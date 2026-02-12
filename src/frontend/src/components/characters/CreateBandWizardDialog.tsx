import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useProjects } from '../../state/useProjects';
import { useCreateMultipleCharacters } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CreateBandWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MemberData {
  name: string;
  background: string;
  motivations: string;
  relationships: string;
  flaws: string;
  voice: string;
  storyRole: string;
}

export default function CreateBandWizardDialog({ open, onOpenChange }: CreateBandWizardDialogProps) {
  const { selectedProjectId, selectedProject } = useProjects();
  const createMultiple = useCreateMultipleCharacters();

  const [step, setStep] = useState<'count' | 'members'>('count');
  const [memberCount, setMemberCount] = useState(2);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [members, setMembers] = useState<MemberData[]>([]);

  const resetWizard = () => {
    setStep('count');
    setMemberCount(2);
    setCurrentMemberIndex(0);
    setMembers([]);
  };

  const handleClose = () => {
    resetWizard();
    onOpenChange(false);
  };

  const handleStartMembers = () => {
    const initialMembers: MemberData[] = Array.from({ length: memberCount }, () => ({
      name: '',
      background: '',
      motivations: '',
      relationships: '',
      flaws: '',
      voice: '',
      storyRole: '',
    }));
    setMembers(initialMembers);
    setStep('members');
    setCurrentMemberIndex(0);
  };

  const updateCurrentMember = (field: keyof MemberData, value: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[currentMemberIndex] = {
        ...updated[currentMemberIndex],
        [field]: value,
      };
      return updated;
    });
  };

  const handleNext = () => {
    const currentMember = members[currentMemberIndex];
    if (!currentMember.name.trim()) {
      toast.error('Please enter a name for this member');
      return;
    }

    // Check for duplicate names
    const existingNames = new Set(
      members.slice(0, currentMemberIndex).map((m) => m.name.toLowerCase())
    );
    if (existingNames.has(currentMember.name.toLowerCase())) {
      toast.error('This name is already used by another member. Please choose a unique name.');
      return;
    }

    // Check against existing characters in project
    const projectCharacterNames = new Set(
      (selectedProject?.characters || []).map((c) => c.name.toLowerCase())
    );
    if (projectCharacterNames.has(currentMember.name.toLowerCase())) {
      toast.error('A character with this name already exists in your project. Please choose a different name.');
      return;
    }

    if (currentMemberIndex < members.length - 1) {
      setCurrentMemberIndex(currentMemberIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentMemberIndex > 0) {
      setCurrentMemberIndex(currentMemberIndex - 1);
    }
  };

  const handleFinish = async () => {
    if (!selectedProjectId) {
      toast.error('No project selected');
      return;
    }

    const currentMember = members[currentMemberIndex];
    if (!currentMember.name.trim()) {
      toast.error('Please enter a name for this member');
      return;
    }

    // Final duplicate check
    const allNames = members.map((m) => m.name.toLowerCase());
    const uniqueNames = new Set(allNames);
    if (allNames.length !== uniqueNames.size) {
      toast.error('All member names must be unique');
      return;
    }

    const projectCharacterNames = new Set(
      (selectedProject?.characters || []).map((c) => c.name.toLowerCase())
    );
    for (const name of allNames) {
      if (projectCharacterNames.has(name)) {
        toast.error(`A character named "${members.find(m => m.name.toLowerCase() === name)?.name}" already exists in your project`);
        return;
      }
    }

    try {
      await createMultiple.mutateAsync({
        projectId: selectedProjectId,
        characters: members,
      });
      toast.success(`Successfully created ${members.length} characters`);
      handleClose();
    } catch (error) {
      toast.error('Failed to create characters');
      console.error(error);
    }
  };

  const currentMember = members[currentMemberIndex];
  const isLastMember = currentMemberIndex === members.length - 1;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === 'count' ? (
          <>
            <DialogHeader>
              <DialogTitle>Create a Band/Group</DialogTitle>
              <DialogDescription>
                How many members are in this band or group?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="member-count">Number of Members (minimum 2)</Label>
                <Input
                  id="member-count"
                  type="number"
                  min={2}
                  max={20}
                  value={memberCount}
                  onChange={(e) => setMemberCount(Math.max(2, parseInt(e.target.value) || 2))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleStartMembers}>
                  Start
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                Member {currentMemberIndex + 1} of {members.length}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for this band/group member
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="member-name">Name *</Label>
                <Input
                  id="member-name"
                  placeholder="e.g., Alex, Jordan, Morgan"
                  value={currentMember?.name || ''}
                  onChange={(e) => updateCurrentMember('name', e.target.value)}
                />
              </div>

              <Accordion type="multiple" className="w-full" defaultValue={['identity']}>
                <AccordionItem value="identity">
                  <AccordionTrigger>Identity & Background</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-background">
                        Who is this character? What's their history, occupation, and defining traits?
                      </Label>
                      <Textarea
                        id="member-background"
                        placeholder="Describe their background, identity, age, occupation, and key personality traits..."
                        value={currentMember?.background || ''}
                        onChange={(e) => updateCurrentMember('background', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="motivations">
                  <AccordionTrigger>Motivations & Goals</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-motivations">
                        What does this character want? What drives them?
                      </Label>
                      <Textarea
                        id="member-motivations"
                        placeholder="Describe their desires, ambitions, fears, and what motivates their actions..."
                        value={currentMember?.motivations || ''}
                        onChange={(e) => updateCurrentMember('motivations', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="relationships">
                  <AccordionTrigger>Relationships</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-relationships">
                        Who are the important people in their life? How do they relate to others?
                      </Label>
                      <Textarea
                        id="member-relationships"
                        placeholder="Describe their family, friends, enemies, romantic interests, and key relationships..."
                        value={currentMember?.relationships || ''}
                        onChange={(e) => updateCurrentMember('relationships', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="flaws">
                  <AccordionTrigger>Conflicts & Flaws</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-flaws">
                        What are their weaknesses, internal conflicts, and obstacles?
                      </Label>
                      <Textarea
                        id="member-flaws"
                        placeholder="Describe their flaws, fears, internal struggles, and external conflicts..."
                        value={currentMember?.flaws || ''}
                        onChange={(e) => updateCurrentMember('flaws', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="voice">
                  <AccordionTrigger>Voice & Dialogue</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-voice">
                        How do they speak? What's their communication style?
                      </Label>
                      <Textarea
                        id="member-voice"
                        placeholder="Describe their speech patterns, vocabulary, tone, and how they express themselves..."
                        value={currentMember?.voice || ''}
                        onChange={(e) => updateCurrentMember('voice', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="arc">
                  <AccordionTrigger>Story Role & Arc</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-storyRole">
                        What role do they play in the story? How will they change?
                      </Label>
                      <Textarea
                        id="member-storyRole"
                        placeholder="Describe their function in the plot, their character arc, and how they'll develop..."
                        value={currentMember?.storyRole || ''}
                        onChange={(e) => updateCurrentMember('storyRole', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentMemberIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  {isLastMember ? (
                    <Button onClick={handleFinish} disabled={createMultiple.isPending}>
                      {createMultiple.isPending ? 'Creating...' : 'Create All Characters'}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="gap-2">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
