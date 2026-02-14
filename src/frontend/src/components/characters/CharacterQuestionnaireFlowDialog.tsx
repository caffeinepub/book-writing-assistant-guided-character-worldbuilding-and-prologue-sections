import { useState, useEffect, useMemo } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { questionnaireModules } from './characterQuestionnaires/moduleRegistry';
import { generateCharacterProfile } from './characterQuestionnaires/characterProfileGenerator';
import { useAddCharacter } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { ModuleAnswers, QuestionnaireProgress } from './characterQuestionnaires/characterQuestionnaireTypes';

interface CharacterQuestionnaireFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  slotIndex: number;
  onComplete: () => void;
}

export default function CharacterQuestionnaireFlowDialog({
  open,
  onOpenChange,
  projectId,
  slotIndex,
  onComplete,
}: CharacterQuestionnaireFlowDialogProps) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [moduleAnswers, setModuleAnswers] = useState<Record<string, ModuleAnswers>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const addCharacter = useAddCharacter();

  // Load progress from localStorage
  useEffect(() => {
    if (open) {
      const storageKey = `character-questionnaire-${projectId}-${slotIndex}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const progress: QuestionnaireProgress = JSON.parse(saved);
          setCurrentModuleIndex(progress.currentModuleIndex);
          setCurrentQuestionIndex(progress.currentQuestionIndex);
          setModuleAnswers(progress.moduleAnswers);
          setCustomInputs(progress.customInputs);
        } catch (e) {
          console.error('Failed to load progress:', e);
        }
      }
    }
  }, [open, projectId, slotIndex]);

  // Save progress to localStorage
  useEffect(() => {
    if (open && !showPreview) {
      const storageKey = `character-questionnaire-${projectId}-${slotIndex}`;
      const progress: QuestionnaireProgress = {
        currentModuleIndex,
        currentQuestionIndex,
        moduleAnswers,
        customInputs,
      };
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [open, projectId, slotIndex, currentModuleIndex, currentQuestionIndex, moduleAnswers, customInputs, showPreview]);

  const currentModule = questionnaireModules[currentModuleIndex];
  const currentQuestion = currentModule?.questions[currentQuestionIndex];
  const isLastModule = currentModuleIndex === questionnaireModules.length - 1;
  const isLastQuestionInModule = currentQuestionIndex === currentModule?.questions.length - 1;

  // Calculate progress
  const totalQuestions = useMemo(() => {
    return questionnaireModules.reduce((sum, module) => sum + module.questions.length, 0);
  }, []);

  const completedQuestions = useMemo(() => {
    let count = 0;
    for (let i = 0; i < currentModuleIndex; i++) {
      count += questionnaireModules[i].questions.length;
    }
    count += currentQuestionIndex;
    return count;
  }, [currentModuleIndex, currentQuestionIndex]);

  const progress = (completedQuestions / totalQuestions) * 100;

  const currentModuleAnswers = moduleAnswers[currentModule?.id] || {};
  const currentAnswer = currentQuestion ? (currentModuleAnswers[currentQuestion.id] || '') : '';

  const handleAnswerChange = (value: string | string[]) => {
    if (!currentModule || !currentQuestion) return;

    setModuleAnswers((prev) => ({
      ...prev,
      [currentModule.id]: {
        ...prev[currentModule.id],
        [currentQuestion.id]: value,
      },
    }));

    // Clear custom input if switching away from option with custom input
    if (currentQuestion.type === 'radio' && typeof value === 'string') {
      const selectedOption = currentQuestion.options?.find((opt) => opt.value === value);
      if (!selectedOption?.allowsCustomInput) {
        setCustomInputs((prev) => {
          const updated = { ...prev };
          delete updated[currentQuestion.id];
          return updated;
        });
      }
    }
  };

  const handleCustomInputChange = (value: string) => {
    if (!currentQuestion) return;
    setCustomInputs((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (isLastQuestionInModule) {
      if (isLastModule) {
        // Show preview
        setShowPreview(true);
      } else {
        // Move to next module
        setCurrentModuleIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (showPreview) {
      setShowPreview(false);
      return;
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex((prev) => prev - 1);
      setCurrentQuestionIndex(questionnaireModules[currentModuleIndex - 1].questions.length - 1);
    }
  };

  const handleSave = async () => {
    try {
      const profile = generateCharacterProfile(moduleAnswers, customInputs);

      await addCharacter.mutateAsync({
        projectId,
        name: profile.name,
        background: profile.background,
        motivations: profile.motivations,
        relationships: profile.relationships,
        flaws: profile.flaws,
        voice: profile.voice,
        storyRole: profile.storyRole,
      });

      // Clear localStorage
      const storageKey = `character-questionnaire-${projectId}-${slotIndex}`;
      localStorage.removeItem(storageKey);

      toast.success('Character created successfully!');
      onComplete();
      onOpenChange(false);

      // Reset state
      setCurrentModuleIndex(0);
      setCurrentQuestionIndex(0);
      setModuleAnswers({});
      setCustomInputs({});
      setShowPreview(false);
    } catch (error) {
      toast.error('Failed to create character');
      console.error(error);
    }
  };

  const generatedProfile = useMemo(() => {
    if (showPreview) {
      return generateCharacterProfile(moduleAnswers, customInputs);
    }
    return null;
  }, [showPreview, moduleAnswers, customInputs]);

  const selectedOption = currentQuestion?.options?.find((opt) => opt.value === currentAnswer);
  const showCustomInput = selectedOption?.allowsCustomInput;

  // Determine current section for display
  const currentSection = currentQuestion?.section || '';
  const previousQuestion = currentQuestionIndex > 0 ? currentModule?.questions[currentQuestionIndex - 1] : null;
  const showSectionHeader = currentSection && currentSection !== previousQuestion?.section;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {showPreview ? 'Character Profile Preview' : `${currentModule?.title || 'Character Questionnaire'}`}
          </DialogTitle>
          <DialogDescription>
            {showPreview
              ? 'Review your character profile before saving'
              : `Module ${currentModuleIndex + 1} of ${questionnaireModules.length} • Question ${currentQuestionIndex + 1} of ${currentModule?.questions.length || 0}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Progress value={progress} className="w-full" />

          {showPreview && generatedProfile ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{generatedProfile.name}</CardTitle>
                </CardHeader>
              </Card>

              {generatedProfile.background && (
                <>
                  <Separator />
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Identity & Background</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{generatedProfile.background}</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {generatedProfile.motivations && (
                <>
                  <Separator />
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Motivations & Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{generatedProfile.motivations}</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {generatedProfile.relationships && (
                <>
                  <Separator />
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Relationships</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{generatedProfile.relationships}</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {generatedProfile.flaws && (
                <>
                  <Separator />
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conflicts & Flaws</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{generatedProfile.flaws}</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {generatedProfile.voice && (
                <>
                  <Separator />
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Voice & Dialogue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{generatedProfile.voice}</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {generatedProfile.storyRole && (
                <>
                  <Separator />
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Story Role & Arc</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{generatedProfile.storyRole}</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          ) : (
            currentQuestion && (
              <div className="space-y-4">
                {showSectionHeader && (
                  <div className="bg-muted/50 px-4 py-2 rounded-md">
                    <h4 className="text-sm font-semibold text-muted-foreground">{currentSection}</h4>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>

                  {currentQuestion.type === 'text' && (
                    <Input
                      value={String(currentAnswer)}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Enter your answer..."
                    />
                  )}

                  {currentQuestion.type === 'textarea' && (
                    <Textarea
                      value={String(currentAnswer)}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Enter your answer..."
                      rows={4}
                    />
                  )}

                  {currentQuestion.type === 'radio' && currentQuestion.options && (
                    <div className="space-y-4">
                      <RadioGroup value={String(currentAnswer)} onValueChange={handleAnswerChange}>
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
                          <Label htmlFor="custom-input">Please specify</Label>
                          <Textarea
                            id="custom-input"
                            placeholder="Enter your custom answer..."
                            value={customInputs[currentQuestion.id] || ''}
                            onChange={(e) => handleCustomInputChange(e.target.value)}
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentModuleIndex === 0 && currentQuestionIndex === 0 && !showPreview}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          {showPreview ? (
            <Button onClick={handleSave} disabled={addCharacter.isPending}>
              {addCharacter.isPending ? 'Saving...' : 'Save Character'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {isLastQuestionInModule && isLastModule ? 'Preview Profile' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
