import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { bookSetupQuestions } from './bookSetupQuestions';
import { useSaveBookSetupAnswers, useGetBookSetupAnswers, useRenameProject } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { BookSetupAnswers } from '../../backend';

interface BookSetupQuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

export default function BookSetupQuestionnaireDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
}: BookSetupQuestionnaireDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [newProjectName, setNewProjectName] = useState(projectName);

  const saveAnswers = useSaveBookSetupAnswers();
  const renameProject = useRenameProject();
  const { data: savedAnswers } = useGetBookSetupAnswers(projectId);

  // Load saved answers when dialog opens
  useEffect(() => {
    if (open && savedAnswers) {
      const loadedAnswers: Record<string, string> = {};
      const loadedCustomInputs: Record<string, string> = {};

      // Load character answers
      if (savedAnswers.characters.length > 0) {
        const char = savedAnswers.characters[0];
        loadedAnswers['characterArchetype'] = char.role || '';
        loadedAnswers['characterBackground'] = char.background || '';
        loadedAnswers['characterMotivation'] = char.motivations || '';
        loadedAnswers['characterVoice'] = char.voice || '';
      }

      // Load worldbuilding answers
      if (savedAnswers.worldbuilding.length > 0) {
        savedAnswers.worldbuilding.forEach((wb) => {
          if (wb.categoryName === 'worldSetting') {
            loadedAnswers['worldSetting'] = wb.description || '';
          } else if (wb.categoryName === 'worldTone') {
            loadedAnswers['worldTone'] = wb.description || '';
          }
        });
      }

      // Load prologue answer
      loadedAnswers['hasPrologue'] = savedAnswers.hasPrologue ? 'yes' : 'no';

      setAnswers(loadedAnswers);
      setCustomInputs(loadedCustomInputs);
    }
  }, [open, savedAnswers]);

  const currentQuestion = bookSetupQuestions[currentStep];
  const totalSteps = bookSetupQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    
    // Clear custom input if switching away from "other" option
    const selectedOption = currentQuestion.options.find((opt) => opt.value === value);
    if (!selectedOption?.allowsCustomInput) {
      setCustomInputs((prev) => {
        const updated = { ...prev };
        delete updated[currentQuestion.id];
        return updated;
      });
    }
  };

  const handleCustomInputChange = (value: string) => {
    setCustomInputs((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSave = async () => {
    try {
      // Save project name if changed
      if (newProjectName !== projectName && newProjectName.trim()) {
        await renameProject.mutateAsync({ id: projectId, newName: newProjectName.trim() });
      }

      // Prepare answers for backend
      const bookSetupAnswers: BookSetupAnswers = {
        characters: [
          {
            name: 'Book Boyfriend',
            background: customInputs['characterBackground'] || answers['characterBackground'] || '',
            motivations: customInputs['characterMotivation'] || answers['characterMotivation'] || '',
            relationships: '',
            flaws: '',
            voice: customInputs['characterVoice'] || answers['characterVoice'] || '',
            role: customInputs['characterArchetype'] || answers['characterArchetype'] || '',
          },
        ],
        worldbuilding: [
          {
            categoryName: 'worldSetting',
            description: customInputs['worldSetting'] || answers['worldSetting'] || '',
            freeformNotes: [],
          },
          {
            categoryName: 'worldTone',
            description: customInputs['worldTone'] || answers['worldTone'] || '',
            freeformNotes: [],
          },
        ],
        hasPrologue: answers['hasPrologue'] === 'yes',
      };

      await saveAnswers.mutateAsync({ projectId, answers: bookSetupAnswers });
      toast.success('Book setup saved successfully');
    } catch (error) {
      toast.error('Failed to save book setup');
      console.error(error);
    }
  };

  const handleFinish = async () => {
    await handleSave();
    onOpenChange(false);
    setCurrentStep(0);
  };

  const selectedAnswer = answers[currentQuestion?.id] || '';
  const selectedOption = currentQuestion?.options.find((opt) => opt.value === selectedAnswer);
  const showCustomInput = selectedOption?.allowsCustomInput;

  // Handle project name question specially
  const isProjectNameQuestion = currentQuestion?.id === 'projectName';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Setup Questionnaire</DialogTitle>
          <DialogDescription>
            Answer these questions to help shape your story. Step {currentStep + 1} of {totalSteps}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Progress value={progress} className="w-full" />

          {currentQuestion && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{currentQuestion.title}</h3>
                {currentQuestion.description && (
                  <p className="text-sm text-muted-foreground">{currentQuestion.description}</p>
                )}
              </div>

              {isProjectNameQuestion ? (
                <div className="space-y-4">
                  <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
                    {currentQuestion.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {selectedAnswer === 'custom' && (
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="project-name-input">Project Name</Label>
                      <Input
                        id="project-name-input"
                        placeholder="Enter project name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
                    {currentQuestion.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {showCustomInput && (
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="custom-input">Please specify (optional)</Label>
                      <Textarea
                        id="custom-input"
                        placeholder="Enter your custom answer..."
                        value={customInputs[currentQuestion.id] || ''}
                        onChange={(e) => handleCustomInputChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} disabled={saveAnswers.isPending}>
              {saveAnswers.isPending ? 'Saving...' : 'Save Progress'}
            </Button>
            {currentStep < totalSteps - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={saveAnswers.isPending}>
                {saveAnswers.isPending ? 'Finishing...' : 'Finish'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
