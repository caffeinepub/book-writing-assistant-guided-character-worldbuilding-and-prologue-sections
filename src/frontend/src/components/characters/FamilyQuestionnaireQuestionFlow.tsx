import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FAMILY_QUESTIONNAIRE_QUESTIONS, FAMILY_QUESTIONNAIRE_SECTIONS, type Question } from './familyQuestionnaireQuestions';
import type { FamilyQuestionnaireAnswers } from './familyQuestionnaireTypes';

interface FamilyQuestionnaireQuestionFlowProps {
  personName: string;
  answers: FamilyQuestionnaireAnswers;
  onAnswerChange: (questionId: string, value: string | string[], customInput?: string) => void;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  isLastPerson: boolean;
  isCreating: boolean;
}

export default function FamilyQuestionnaireQuestionFlow({
  personName,
  answers,
  onAnswerChange,
  onBack,
  onNext,
  onFinish,
  isLastPerson,
  isCreating,
}: FamilyQuestionnaireQuestionFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = FAMILY_QUESTIONNAIRE_QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const totalQuestions = FAMILY_QUESTIONNAIRE_QUESTIONS.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Get current section and question number within section
  const currentSection = currentQuestion.section;
  const sectionQuestions = FAMILY_QUESTIONNAIRE_QUESTIONS.filter((q) => q.section === currentSection);
  const questionIndexInSection = sectionQuestions.findIndex((q) => q.id === currentQuestion.id);

  const handleRadioChange = (value: string) => {
    const option = currentQuestion.options.find((opt) => opt.value === value);
    if (option?.allowCustomInput) {
      onAnswerChange(currentQuestion.id, value, currentAnswer?.customInput || '');
    } else {
      onAnswerChange(currentQuestion.id, value);
    }
  };

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(currentAnswer?.value) ? currentAnswer.value : [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v) => v !== optionValue);
    onAnswerChange(currentQuestion.id, newValues);
  };

  const handleCustomInputChange = (text: string) => {
    const value = currentAnswer?.value || '';
    onAnswerChange(currentQuestion.id, value, text);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question for this person
      if (isLastPerson) {
        onFinish();
      } else {
        onNext();
      }
    }
  };

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id];
    const selectedValue = answer?.value;
    const customInput = answer?.customInput || '';

    if (question.type === 'radio') {
      const selectedOption = question.options.find((opt) => opt.value === selectedValue);
      const showCustomInput = selectedOption?.allowCustomInput;

      return (
        <div className="space-y-4">
          <RadioGroup value={selectedValue as string || ''} onValueChange={handleRadioChange}>
            <div className="space-y-3">
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showCustomInput && (
            <div className="mt-4 pl-6">
              <Label htmlFor={`${question.id}-custom`} className="text-sm text-muted-foreground">
                Please specify:
              </Label>
              <Input
                id={`${question.id}-custom`}
                placeholder="Enter your answer..."
                value={customInput}
                onChange={(e) => handleCustomInputChange(e.target.value)}
                className="mt-2"
              />
            </div>
          )}
        </div>
      );
    }

    if (question.type === 'select') {
      return (
        <Select value={selectedValue as string || ''} onValueChange={handleRadioChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (question.type === 'checkbox') {
      const selectedValues = Array.isArray(selectedValue) ? selectedValue : [];
      return (
        <div className="space-y-3">
          {question.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <Checkbox
                id={`${question.id}-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
              />
              <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer font-normal">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Section header */}
      <div className="border-l-4 border-primary pl-4">
        <p className="text-sm font-medium text-primary">{currentSection}</p>
        <p className="text-xs text-muted-foreground">
          Question {questionIndexInSection + 1} of {sectionQuestions.length} in this section
        </p>
      </div>

      {/* Question */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{currentQuestion.question}</h3>
          {currentQuestion.description && (
            <p className="text-sm text-muted-foreground">{currentQuestion.description}</p>
          )}
        </div>
        {renderQuestion(currentQuestion)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={handlePrevious} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          {currentQuestionIndex === 0 ? 'Back to Setup' : 'Previous'}
        </Button>
        <div className="flex gap-2">
          {currentQuestionIndex === totalQuestions - 1 && isLastPerson ? (
            <Button onClick={handleNextQuestion} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create All Characters'}
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="gap-2">
              {currentQuestionIndex === totalQuestions - 1 ? 'Next Person' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
