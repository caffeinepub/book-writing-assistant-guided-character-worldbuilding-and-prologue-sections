import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useProjects } from '../../state/useProjects';
import { useSavePrologue } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { PrologueView } from '../../backend';

interface PrologueEditorProps {
  prologue?: PrologueView;
}

export default function PrologueEditor({ prologue }: PrologueEditorProps) {
  const { selectedProjectId } = useProjects();
  const savePrologue = useSavePrologue();

  const [formData, setFormData] = useState({
    hook: '',
    povVoice: '',
    stakes: '',
    keyReveals: '',
    connectionToChapterOne: '',
    draft: '',
  });

  useEffect(() => {
    if (prologue) {
      setFormData({
        hook: prologue.hook || '',
        povVoice: prologue.povVoice || '',
        stakes: prologue.stakes || '',
        keyReveals: prologue.keyReveals || '',
        connectionToChapterOne: prologue.connectionToChapterOne || '',
        draft: prologue.draft || '',
      });
    }
  }, [prologue]);

  const handleSave = async () => {
    if (!selectedProjectId) {
      toast.error('No project selected');
      return;
    }

    try {
      await savePrologue.mutateAsync({
        projectId: selectedProjectId,
        ...formData,
      });
      toast.success('First encounter saved successfully');
    } catch (error) {
      toast.error('Failed to save first encounter');
      console.error(error);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="w-full" defaultValue={['hook']}>
        <AccordionItem value="hook">
          <AccordionTrigger>Hook</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="hook">
                What immediately grabs the reader's attention? What question or tension opens your story?
              </Label>
              <Textarea
                id="hook"
                placeholder="Describe the opening moment, image, or question that hooks readers..."
                value={formData.hook}
                onChange={(e) => updateField('hook', e.target.value)}
                rows={4}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pov">
          <AccordionTrigger>POV & Voice</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="povVoice">
                Whose perspective tells this opening? What's the narrative voice and tone?
              </Label>
              <Textarea
                id="povVoice"
                placeholder="Describe the point of view, narrative voice, and tone of the opening..."
                value={formData.povVoice}
                onChange={(e) => updateField('povVoice', e.target.value)}
                rows={4}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stakes">
          <AccordionTrigger>Stakes</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="stakes">
                What's at risk? Why should readers care about what happens next?
              </Label>
              <Textarea
                id="stakes"
                placeholder="Describe what's at stake and why it matters..."
                value={formData.stakes}
                onChange={(e) => updateField('stakes', e.target.value)}
                rows={4}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="reveals">
          <AccordionTrigger>Key Information & Reveals</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="keyReveals">
                What essential information does the opening reveal? What mysteries does it introduce?
              </Label>
              <Textarea
                id="keyReveals"
                placeholder="Describe what readers learn and what questions are raised..."
                value={formData.keyReveals}
                onChange={(e) => updateField('keyReveals', e.target.value)}
                rows={4}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="connection">
          <AccordionTrigger>Connection to Chapter One</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="connectionToChapterOne">
                How does this opening connect to or contrast with the first chapter?
              </Label>
              <Textarea
                id="connectionToChapterOne"
                placeholder="Describe how the opening sets up or contrasts with Chapter One..."
                value={formData.connectionToChapterOne}
                onChange={(e) => updateField('connectionToChapterOne', e.target.value)}
                rows={4}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-2 pt-4">
        <Label htmlFor="draft">Opening Draft</Label>
        <Textarea
          id="draft"
          placeholder="Write your opening here..."
          value={formData.draft}
          onChange={(e) => updateField('draft', e.target.value)}
          rows={16}
          className="font-serif"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={savePrologue.isPending}>
          {savePrologue.isPending ? 'Saving...' : 'Save First Encounter'}
        </Button>
      </div>
    </div>
  );
}
