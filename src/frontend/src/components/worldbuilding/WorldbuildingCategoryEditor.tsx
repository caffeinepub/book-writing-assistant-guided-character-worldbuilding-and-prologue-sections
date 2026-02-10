import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useProjects } from '../../state/useProjects';
import { useUpdateWorldbuildingCategory, useAddWorldbuildingNote } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface WorldbuildingCategoryEditorProps {
  categoryName: string;
  categoryIndex: number;
  prompts: string[];
  initialDescription: string;
  initialNotes: string[];
}

export default function WorldbuildingCategoryEditor({
  categoryName,
  categoryIndex,
  prompts,
  initialDescription,
  initialNotes,
}: WorldbuildingCategoryEditorProps) {
  const { selectedProjectId } = useProjects();
  const updateCategory = useUpdateWorldbuildingCategory();
  const addNote = useAddWorldbuildingNote();

  const [description, setDescription] = useState(initialDescription);
  const [newNote, setNewNote] = useState('');

  const handleSaveDescription = async () => {
    if (!selectedProjectId) {
      toast.error('No project selected');
      return;
    }

    try {
      await updateCategory.mutateAsync({
        projectId: selectedProjectId,
        categoryName,
        description,
      });
      toast.success('Description saved');
    } catch (error) {
      toast.error('Failed to save description');
      console.error(error);
    }
  };

  const handleAddNote = async () => {
    if (!selectedProjectId || !newNote.trim()) {
      return;
    }

    try {
      await addNote.mutateAsync({
        projectId: selectedProjectId,
        categoryName,
        note: newNote.trim(),
      });
      setNewNote('');
      toast.success('Note added');
    } catch (error) {
      toast.error('Failed to add note');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="space-y-2">
        <Label>Overview</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Consider: {prompts.join(', ')}
        </p>
        <Textarea
          placeholder={`Describe the ${categoryName.toLowerCase()} of your world...`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />
        <Button
          onClick={handleSaveDescription}
          disabled={updateCategory.isPending}
          size="sm"
        >
          {updateCategory.isPending ? 'Saving...' : 'Save Description'}
        </Button>
      </div>

      <div className="space-y-3">
        <Label>Additional Notes</Label>
        {initialNotes.length > 0 && (
          <div className="space-y-2">
            {initialNotes.map((note, index) => (
              <Card key={index}>
                <CardContent className="p-3">
                  <p className="text-sm">{note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Add a quick note or detail..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
          />
          <Button
            onClick={handleAddNote}
            disabled={addNote.isPending || !newNote.trim()}
            size="icon"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
