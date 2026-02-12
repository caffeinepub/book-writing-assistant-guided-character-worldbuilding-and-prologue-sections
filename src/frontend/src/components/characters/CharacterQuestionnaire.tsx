import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useProjects } from '../../state/useProjects';
import { useAddCharacter, useUpdateCharacter } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { CharacterView } from '../../backend';

interface CharacterQuestionnaireProps {
  mode?: 'create' | 'edit';
  initialData?: CharacterView;
  onComplete: () => void;
  onCancel: () => void;
}

export default function CharacterQuestionnaire({ 
  mode = 'create',
  initialData,
  onComplete, 
  onCancel 
}: CharacterQuestionnaireProps) {
  const { selectedProjectId } = useProjects();
  const addCharacter = useAddCharacter();
  const updateCharacter = useUpdateCharacter();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    background: initialData?.background || '',
    motivations: initialData?.motivations || '',
    relationships: initialData?.relationships || '',
    flaws: initialData?.flaws || '',
    voice: initialData?.voice || '',
    storyRole: initialData?.storyRole || '',
  });

  const handleSubmit = async () => {
    if (!selectedProjectId) {
      toast.error('No project selected');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter a name for your character');
      return;
    }

    try {
      if (mode === 'edit') {
        await updateCharacter.mutateAsync({
          projectId: selectedProjectId,
          ...formData,
        });
        toast.success('Character updated successfully');
      } else {
        await addCharacter.mutateAsync({
          projectId: selectedProjectId,
          ...formData,
        });
        toast.success('Character created successfully');
      }
      onComplete();
    } catch (error) {
      toast.error(mode === 'edit' ? 'Failed to update character' : 'Failed to create character');
      console.error(error);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isPending = mode === 'edit' ? updateCharacter.isPending : addCharacter.isPending;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="char-name">Name *</Label>
        {mode === 'edit' ? (
          <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
            {formData.name}
          </div>
        ) : (
          <Input
            id="char-name"
            placeholder="e.g., Alex, Jordan, Morgan"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
        )}
      </div>

      <Accordion type="multiple" className="w-full" defaultValue={['identity']}>
        <AccordionItem value="identity">
          <AccordionTrigger>Identity & Background</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="background">
                Who is this character? What's their history, occupation, and defining traits?
              </Label>
              <Textarea
                id="background"
                placeholder="Describe their background, identity, age, occupation, and key personality traits..."
                value={formData.background}
                onChange={(e) => updateField('background', e.target.value)}
                rows={6}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="motivations">
          <AccordionTrigger>Motivations & Goals</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="motivations">
                What does this character want? What drives them? What are their short-term and long-term goals?
              </Label>
              <Textarea
                id="motivations"
                placeholder="Describe their desires, ambitions, fears, and what motivates their actions..."
                value={formData.motivations}
                onChange={(e) => updateField('motivations', e.target.value)}
                rows={6}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="relationships">
          <AccordionTrigger>Relationships</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="relationships">
                Who are the important people in their life? How do they relate to others?
              </Label>
              <Textarea
                id="relationships"
                placeholder="Describe their family, friends, enemies, romantic interests, and key relationships..."
                value={formData.relationships}
                onChange={(e) => updateField('relationships', e.target.value)}
                rows={6}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="flaws">
          <AccordionTrigger>Conflicts & Flaws</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="flaws">
                What are their weaknesses, internal conflicts, and obstacles they face?
              </Label>
              <Textarea
                id="flaws"
                placeholder="Describe their flaws, fears, internal struggles, and external conflicts..."
                value={formData.flaws}
                onChange={(e) => updateField('flaws', e.target.value)}
                rows={6}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="voice">
          <AccordionTrigger>Voice & Dialogue</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="voice">
                How do they speak? What's their communication style and verbal quirks?
              </Label>
              <Textarea
                id="voice"
                placeholder="Describe their speech patterns, vocabulary, tone, and how they express themselves..."
                value={formData.voice}
                onChange={(e) => updateField('voice', e.target.value)}
                rows={6}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="arc">
          <AccordionTrigger>Story Role & Arc</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="storyRole">
                What role do they play in the story? How will they change or grow?
              </Label>
              <Textarea
                id="storyRole"
                placeholder="Describe their function in the plot, their character arc, and how they'll develop..."
                value={formData.storyRole}
                onChange={(e) => updateField('storyRole', e.target.value)}
                rows={6}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update Character' : 'Create Character')}
        </Button>
      </div>
    </div>
  );
}
