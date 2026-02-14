import { coreCharacterModule } from './coreCharacterQuestions';
import { personalityModule } from './personalityQuestions';
import { styleModule } from './styleQuestions';
import type { QuestionnaireModule } from './characterQuestionnaireTypes';

export const questionnaireModules: QuestionnaireModule[] = [
  coreCharacterModule,
  personalityModule,
  styleModule,
];
