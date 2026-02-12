export interface QuestionOption {
  value: string;
  label: string;
  allowsCustomInput?: boolean;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: 'radio' | 'checkbox' | 'select';
  options: QuestionOption[];
  category: 'character' | 'worldbuilding' | 'prologue' | 'project';
}

export const bookSetupQuestions: Question[] = [
  // Project name (optional)
  {
    id: 'projectName',
    title: 'Project Name (Optional)',
    description: 'You can name your project now or later.',
    type: 'radio',
    category: 'project',
    options: [
      { value: 'skip', label: 'Skip for now' },
      { value: 'custom', label: 'Enter a name', allowsCustomInput: true },
    ],
  },
  // Character questions
  {
    id: 'characterArchetype',
    title: 'What type of book boyfriend are you creating?',
    description: 'Choose the archetype that best fits your character.',
    type: 'radio',
    category: 'character',
    options: [
      { value: 'brooding-hero', label: 'Brooding Hero (Dark, mysterious, protective)' },
      { value: 'charming-rogue', label: 'Charming Rogue (Witty, playful, adventurous)' },
      { value: 'gentle-giant', label: 'Gentle Giant (Strong but tender, loyal)' },
      { value: 'tortured-soul', label: 'Tortured Soul (Haunted past, seeking redemption)' },
      { value: 'alpha-leader', label: 'Alpha Leader (Commanding, confident, dominant)' },
      { value: 'intellectual', label: 'Intellectual (Smart, thoughtful, reserved)' },
      { value: 'other', label: 'Other', allowsCustomInput: true },
    ],
  },
  {
    id: 'characterBackground',
    title: 'What\'s his background?',
    description: 'Select the background that shapes his identity.',
    type: 'radio',
    category: 'character',
    options: [
      { value: 'royalty', label: 'Royalty or nobility' },
      { value: 'warrior', label: 'Warrior or soldier' },
      { value: 'criminal', label: 'Criminal or outlaw' },
      { value: 'scholar', label: 'Scholar or academic' },
      { value: 'artist', label: 'Artist or creative' },
      { value: 'businessman', label: 'Businessman or entrepreneur' },
      { value: 'supernatural', label: 'Supernatural being (vampire, werewolf, fae, etc.)' },
      { value: 'other', label: 'Other', allowsCustomInput: true },
    ],
  },
  {
    id: 'characterMotivation',
    title: 'What drives him?',
    description: 'Choose his primary motivation.',
    type: 'radio',
    category: 'character',
    options: [
      { value: 'revenge', label: 'Revenge or justice' },
      { value: 'redemption', label: 'Redemption for past mistakes' },
      { value: 'protection', label: 'Protecting someone or something' },
      { value: 'power', label: 'Gaining power or control' },
      { value: 'love', label: 'Finding or keeping love' },
      { value: 'freedom', label: 'Freedom or independence' },
      { value: 'duty', label: 'Duty or honor' },
      { value: 'other', label: 'Other', allowsCustomInput: true },
    ],
  },
  {
    id: 'characterVoice',
    title: 'How does he speak?',
    description: 'Select his communication style.',
    type: 'radio',
    category: 'character',
    options: [
      { value: 'formal', label: 'Formal and eloquent' },
      { value: 'casual', label: 'Casual and modern' },
      { value: 'sarcastic', label: 'Sarcastic and witty' },
      { value: 'blunt', label: 'Blunt and direct' },
      { value: 'poetic', label: 'Poetic and romantic' },
      { value: 'quiet', label: 'Quiet and reserved' },
      { value: 'other', label: 'Other', allowsCustomInput: true },
    ],
  },
  // Worldbuilding questions
  {
    id: 'worldSetting',
    title: 'Where does your story take place?',
    description: 'Choose the primary setting for your world.',
    type: 'radio',
    category: 'worldbuilding',
    options: [
      { value: 'contemporary', label: 'Contemporary (Modern day)' },
      { value: 'historical', label: 'Historical (Past era)' },
      { value: 'fantasy', label: 'Fantasy realm' },
      { value: 'paranormal', label: 'Paranormal (Modern with supernatural)' },
      { value: 'dystopian', label: 'Dystopian future' },
      { value: 'small-town', label: 'Small town' },
      { value: 'big-city', label: 'Big city' },
      { value: 'other', label: 'Other', allowsCustomInput: true },
    ],
  },
  {
    id: 'worldTone',
    title: 'What\'s the tone of your world?',
    description: 'Select the overall atmosphere.',
    type: 'radio',
    category: 'worldbuilding',
    options: [
      { value: 'dark-dangerous', label: 'Dark and dangerous' },
      { value: 'light-hopeful', label: 'Light and hopeful' },
      { value: 'mysterious', label: 'Mysterious and secretive' },
      { value: 'glamorous', label: 'Glamorous and luxurious' },
      { value: 'gritty-realistic', label: 'Gritty and realistic' },
      { value: 'magical-whimsical', label: 'Magical and whimsical' },
      { value: 'other', label: 'Other', allowsCustomInput: true },
    ],
  },
  // Prologue question
  {
    id: 'hasPrologue',
    title: 'Will your story have a prologue?',
    description: 'A prologue can set the stage before the main story begins.',
    type: 'radio',
    category: 'prologue',
    options: [
      { value: 'yes', label: 'Yes, I want a prologue' },
      { value: 'no', label: 'No, start with Chapter 1' },
      { value: 'unsure', label: 'Not sure yet' },
    ],
  },
];
