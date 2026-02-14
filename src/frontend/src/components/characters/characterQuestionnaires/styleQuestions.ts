import type { QuestionnaireModule } from './characterQuestionnaireTypes';

export const styleModule: QuestionnaireModule = {
  id: 'style',
  title: 'Style & Expression',
  description: 'Define how your character presents themselves and expresses their identity.',
  questions: [
    { id: 'style_fashion', text: 'How would you describe the character\'s fashion style?', type: 'radio', options: [
      { value: 'casual', label: 'Casual and comfortable' },
      { value: 'formal', label: 'Formal and polished' },
      { value: 'trendy', label: 'Trendy and fashionable' },
      { value: 'eclectic', label: 'Eclectic and unique' },
      { value: 'practical', label: 'Practical and functional' },
      { value: 'neglected', label: 'Neglected or unkempt' },
    ]},
    { id: 'style_colors', text: 'What colors does the character typically wear?', type: 'text' },
    { id: 'style_accessories', text: 'Does the character wear any signature accessories or jewelry?', type: 'text' },
    { id: 'style_grooming', text: 'How does the character approach grooming and personal care?', type: 'radio', options: [
      { value: 'meticulous', label: 'Meticulous and detailed' },
      { value: 'well_maintained', label: 'Well-maintained' },
      { value: 'basic', label: 'Basic hygiene only' },
      { value: 'minimal', label: 'Minimal effort' },
      { value: 'neglected', label: 'Often neglected' },
    ]},
    { id: 'style_body_language', text: 'What is the character\'s typical body language?', type: 'radio', options: [
      { value: 'confident', label: 'Confident and open' },
      { value: 'reserved', label: 'Reserved and closed off' },
      { value: 'nervous', label: 'Nervous and fidgety' },
      { value: 'relaxed', label: 'Relaxed and casual' },
      { value: 'aggressive', label: 'Aggressive or intimidating' },
    ]},
    { id: 'style_voice_tone', text: 'What is the character\'s typical tone of voice?', type: 'radio', options: [
      { value: 'warm', label: 'Warm and friendly' },
      { value: 'cold', label: 'Cold and distant' },
      { value: 'energetic', label: 'Energetic and animated' },
      { value: 'monotone', label: 'Monotone or flat' },
      { value: 'sarcastic', label: 'Sarcastic or ironic' },
      { value: 'soft', label: 'Soft and gentle' },
    ]},
    { id: 'style_speech_pattern', text: 'Does the character have any distinctive speech patterns?', type: 'text' },
    { id: 'style_living_space', text: 'How would you describe the character\'s living space?', type: 'radio', options: [
      { value: 'organized', label: 'Organized and tidy' },
      { value: 'messy', label: 'Messy and chaotic' },
      { value: 'minimalist', label: 'Minimalist' },
      { value: 'cluttered', label: 'Cluttered with possessions' },
      { value: 'cozy', label: 'Cozy and comfortable' },
      { value: 'sparse', label: 'Sparse and bare' },
    ]},
  ],
};
