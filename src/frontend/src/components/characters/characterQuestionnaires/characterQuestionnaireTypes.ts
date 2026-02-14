export type QuestionType = 'radio' | 'select' | 'checkbox' | 'text' | 'textarea';

export interface QuestionOption {
  value: string;
  label: string;
  allowsCustomInput?: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  section?: string;
}

export interface QuestionnaireModule {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export type ModuleAnswers = Record<string, string | string[]>;

export interface QuestionnaireProgress {
  currentModuleIndex: number;
  currentQuestionIndex: number;
  moduleAnswers: Record<string, ModuleAnswers>;
  customInputs: Record<string, string>;
}
