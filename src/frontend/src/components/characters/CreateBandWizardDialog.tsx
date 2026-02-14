import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProjects } from '../../state/useProjects';
import { useAddMultipleCharacters } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { GROUP_LEVEL_QUESTIONS } from './bandQuestionnaireQuestions';
import BandQuestionnaireFlow from './BandQuestionnaireFlow';
import { generateBandCharacterText } from './bandQuestionnaireTextGenerator';

interface CreateBandWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'count' | 'group-setup' | 'members';

interface MemberAnswers {
  name: string;
  answers: Record<string, string>;
}

export default function CreateBandWizardDialog({ open, onOpenChange }: CreateBandWizardDialogProps) {
  const { selectedProjectId, selectedProject } = useProjects();
  const createMultiple = useAddMultipleCharacters();

  const [step, setStep] = useState<Step>('count');
  const [memberCount, setMemberCount] = useState(2);
  const [groupAnswers, setGroupAnswers] = useState<Record<string, string>>({});
  const [customGroupInputs, setCustomGroupInputs] = useState<Record<string, string>>({});
  const [members, setMembers] = useState<MemberAnswers[]>([]);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);

  const resetWizard = () => {
    setStep('count');
    setMemberCount(2);
    setGroupAnswers({});
    setCustomGroupInputs({});
    setMembers([]);
    setCurrentMemberIndex(0);
  };

  const handleClose = () => {
    resetWizard();
    onOpenChange(false);
  };

  const handleStartGroupSetup = () => {
    setStep('group-setup');
  };

  const handleStartMembers = () => {
    // Validate group setup
    if (!groupAnswers['group-name']?.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    if (!groupAnswers['group-genre']) {
      toast.error('Please select a genre');
      return;
    }

    const initialMembers: MemberAnswers[] = Array.from({ length: memberCount }, (_, i) => ({
      name: '',
      answers: {},
    }));
    setMembers(initialMembers);
    setStep('members');
    setCurrentMemberIndex(0);
  };

  const handleMemberNameChange = (name: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[currentMemberIndex] = {
        ...updated[currentMemberIndex],
        name,
      };
      return updated;
    });
  };

  const handleMemberAnswerChange = (questionId: string, value: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[currentMemberIndex] = {
        ...updated[currentMemberIndex],
        answers: {
          ...updated[currentMemberIndex].answers,
          [questionId]: value,
        },
      };
      return updated;
    });
  };

  const handleBackFromMember = () => {
    if (currentMemberIndex > 0) {
      setCurrentMemberIndex(currentMemberIndex - 1);
    } else {
      setStep('group-setup');
    }
  };

  const handleNextMember = () => {
    const currentMember = members[currentMemberIndex];
    if (!currentMember.name.trim()) {
      toast.error('Please enter a name for this member');
      return;
    }

    // Check for duplicate names
    const existingNames = new Set(members.slice(0, currentMemberIndex).map((m) => m.name.toLowerCase()));
    if (existingNames.has(currentMember.name.toLowerCase())) {
      toast.error('This name is already used by another member. Please choose a unique name.');
      return;
    }

    // Check against existing characters in project
    const projectCharacterNames = new Set((selectedProject?.characters || []).map((c) => c.name.toLowerCase()));
    if (projectCharacterNames.has(currentMember.name.toLowerCase())) {
      toast.error('A character with this name already exists in your project. Please choose a different name.');
      return;
    }

    if (currentMemberIndex < members.length - 1) {
      setCurrentMemberIndex(currentMemberIndex + 1);
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

    const projectCharacterNames = new Set((selectedProject?.characters || []).map((c) => c.name.toLowerCase()));
    for (const name of allNames) {
      if (projectCharacterNames.has(name)) {
        toast.error(
          `A character named "${members.find((m) => m.name.toLowerCase() === name)?.name}" already exists in your project`
        );
        return;
      }
    }

    try {
      const groupData = {
        groupName: groupAnswers['group-name'],
        groupGenre:
          groupAnswers['group-genre'] === 'other' && customGroupInputs['group-genre']
            ? customGroupInputs['group-genre']
            : groupAnswers['group-genre'],
        groupVibe: groupAnswers['group-vibe'] || '',
      };

      const characters = members.map((member) => generateBandCharacterText(member, groupData, members));

      await createMultiple.mutateAsync({
        projectId: selectedProjectId,
        characters,
      });
      toast.success(`Successfully created ${members.length} characters from ${groupData.groupName}`);
      handleClose();
    } catch (error) {
      toast.error('Failed to create characters');
      console.error(error);
    }
  };

  const isLastMember = currentMemberIndex === members.length - 1;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === 'count' && (
          <>
            <DialogHeader>
              <DialogTitle>Create a Band/Group</DialogTitle>
              <DialogDescription>How many members are in this band or group?</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="member-count">Number of Members (2-45)</Label>
                <Input
                  id="member-count"
                  type="number"
                  min={2}
                  max={45}
                  value={memberCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 2;
                    setMemberCount(Math.max(2, Math.min(45, val)));
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  You can create groups with up to 45 members (perfect for large K-pop groups or orchestras!)
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleStartGroupSetup}>Next</Button>
              </div>
            </div>
          </>
        )}

        {step === 'group-setup' && (
          <>
            <DialogHeader>
              <DialogTitle>Group Setup</DialogTitle>
              <DialogDescription>Tell us about the band or group as a whole</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {GROUP_LEVEL_QUESTIONS.map((question) => (
                <div key={question.id} className="space-y-2">
                  <Label className="text-base">{question.text}</Label>
                  {question.type === 'text' && (
                    <Input
                      value={groupAnswers[question.id] || ''}
                      onChange={(e) =>
                        setGroupAnswers((prev) => ({
                          ...prev,
                          [question.id]: e.target.value,
                        }))
                      }
                      placeholder={question.placeholder}
                    />
                  )}
                  {question.type === 'textarea' && (
                    <Textarea
                      value={groupAnswers[question.id] || ''}
                      onChange={(e) =>
                        setGroupAnswers((prev) => ({
                          ...prev,
                          [question.id]: e.target.value,
                        }))
                      }
                      placeholder={question.placeholder}
                      rows={4}
                    />
                  )}
                  {question.type === 'radio' && (
                    <RadioGroup
                      value={groupAnswers[question.id] || ''}
                      onValueChange={(value) => {
                        setGroupAnswers((prev) => ({
                          ...prev,
                          [question.id]: value,
                        }));
                        if (value !== 'other') {
                          setCustomGroupInputs((prev) => ({ ...prev, [question.id]: '' }));
                        }
                      }}
                      className="space-y-2"
                    >
                      {question.options?.map((option) => (
                        <div key={option.value} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                            <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer font-normal">
                              {option.label}
                            </Label>
                          </div>
                          {option.allowCustom && groupAnswers[question.id] === option.value && (
                            <Input
                              value={customGroupInputs[question.id] || ''}
                              onChange={(e) =>
                                setCustomGroupInputs((prev) => ({
                                  ...prev,
                                  [question.id]: e.target.value,
                                }))
                              }
                              placeholder="Please specify..."
                              className="ml-6"
                            />
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              ))}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep('count')}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleStartMembers}>Start Member Questions</Button>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 'members' && (
          <>
            <DialogHeader>
              <DialogTitle>
                Member {currentMemberIndex + 1} of {members.length}
              </DialogTitle>
              <DialogDescription>Answer questions about this band/group member</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">Member Name *</Label>
                <Input
                  id="member-name"
                  placeholder="e.g., Alex, Jordan, Morgan"
                  value={members[currentMemberIndex]?.name || ''}
                  onChange={(e) => handleMemberNameChange(e.target.value)}
                />
              </div>
              <BandQuestionnaireFlow
                memberIndex={currentMemberIndex}
                totalMembers={members.length}
                memberName={members[currentMemberIndex]?.name || ''}
                answers={members[currentMemberIndex]?.answers || {}}
                onAnswerChange={handleMemberAnswerChange}
                onBack={handleBackFromMember}
                onNext={handleNextMember}
                onFinish={handleFinish}
                isLastMember={isLastMember}
                isCreating={createMultiple.isPending}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
