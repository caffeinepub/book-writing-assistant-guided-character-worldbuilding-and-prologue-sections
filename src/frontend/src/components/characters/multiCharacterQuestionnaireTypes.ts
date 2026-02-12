// Types and constants for the multi-character family-tree questionnaire

export const FAMILY_ROLES = [
  { value: 'mother', label: 'Mother' },
  { value: 'father', label: 'Father' },
  { value: 'grandparent', label: 'Grandparent' },
  { value: 'child', label: 'Child/Kid' },
  { value: 'other', label: 'Other' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

export type FamilyRole = typeof FAMILY_ROLES[number]['value'];
export type Gender = typeof GENDER_OPTIONS[number]['value'];

export interface PersonDraft {
  id: string;
  name: string;
  familyRole: FamilyRole;
  gender: Gender;
  background: string;
  motivations: string;
  relationships: string;
  flaws: string;
  voice: string;
  storyRole: string;
}

export interface QuestionnaireState {
  people: PersonDraft[];
  currentStep: 'setup' | 'details';
  currentPersonIndex: number;
}
