import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MEMBER_QUESTIONS, type BandQuestion } from './bandQuestionnaireQuestions';

interface BandQuestionnaireFlowProps {
  memberIndex: number;
  totalMembers: number;
  memberName: string;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  isLastMember: boolean;
  isCreating: boolean;
}

export default function BandQuestionnaireFlow({
  memberIndex,
  totalMembers,
  memberName,
  answers,
  onAnswerChange,
  onBack,
  onNext,
  onFinish,
  isLastMember,
  isCreating,
}: BandQuestionnaireFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

  const currentQuestion = MEMBER_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / MEMBER_QUESTIONS.length) * 100;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === MEMBER_QUESTIONS.length - 1;

  const handlePrevious = () => {
    if (isFirstQuestion) {
      onBack();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      if (isLastMember) {
        onFinish();
      } else {
        onNext();
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const renderQuestionInput = (question: BandQuestion) => {
    const currentAnswer = answers[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <Input
            value={currentAnswer}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="mt-2"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={currentAnswer}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={6}
            className="mt-2"
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={currentAnswer}
            onValueChange={(value) => {
              onAnswerChange(question.id, value);
              if (value !== 'other') {
                setCustomInputs((prev) => ({ ...prev, [question.id]: '' }));
              }
            }}
            className="mt-4 space-y-3"
          >
            {question.options?.map((option) => (
              <div key={option.value} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer font-normal">
                    {option.label}
                  </Label>
                </div>
                {option.allowCustom && currentAnswer === option.value && (
                  <Input
                    value={customInputs[question.id] || ''}
                    onChange={(e) => {
                      setCustomInputs((prev) => ({ ...prev, [question.id]: e.target.value }));
                      onAnswerChange(`${question.id}-custom`, e.target.value);
                    }}
                    placeholder="Please specify..."
                    className="ml-6"
                  />
                )}
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  // Group questions by section for display
  const currentSection = currentQuestion.section;
  const sectionQuestions = MEMBER_QUESTIONS.filter((q) => q.section === currentSection);
  const questionIndexInSection = sectionQuestions.findIndex((q) => q.id === currentQuestion.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Member {memberIndex + 1} of {totalMembers}: {memberName || 'Unnamed Member'}
          </span>
          <span>
            Question {currentQuestionIndex + 1} of {MEMBER_QUESTIONS.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Section header */}
      <div className="space-y-1">
        <div className="text-sm font-medium text-primary">
          {currentSection} ({questionIndexInSection + 1} of {sectionQuestions.length})
        </div>
      </div>

      {/* Question */}
      <div className="space-y-4 py-4">
        <Label className="text-base font-medium">{currentQuestion.text}</Label>
        {renderQuestionInput(currentQuestion)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={handlePrevious} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          {isFirstQuestion ? 'Previous Member' : 'Previous'}
        </Button>
        <Button onClick={handleNextQuestion} disabled={isCreating} className="gap-2">
          {isLastQuestion && isLastMember ? (
            isCreating ? (
              'Creating...'
            ) : (
              'Create All Characters'
            )
          ) : isLastQuestion ? (
            <>
              Next Member
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
