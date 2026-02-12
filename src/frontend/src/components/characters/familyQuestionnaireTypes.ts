// Type definitions for the family questionnaire answer model

export interface FamilyQuestionnaireAnswers {
  [questionId: string]: {
    value: string | string[]; // Single value for radio/select, array for checkbox
    customInput?: string; // Optional custom text when "Other" is selected
  };
}

export interface FamilyQuestionnairePersonAnswers {
  answers: FamilyQuestionnaireAnswers;
  isMainCharacter?: boolean;
  parentIds?: string[]; // IDs of other people who are this person's parents
}
