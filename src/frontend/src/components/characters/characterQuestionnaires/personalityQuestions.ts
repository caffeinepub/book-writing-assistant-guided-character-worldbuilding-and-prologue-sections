import type { QuestionnaireModule } from './characterQuestionnaireTypes';

export const personalityModule: QuestionnaireModule = {
  id: 'personality',
  title: 'Personality Deep Dive',
  description: 'Explore the nuances of your character\'s personality and behavior patterns.',
  questions: [
    { id: 'pers_communication', text: 'How does the character communicate with others?', type: 'radio', options: [
      { value: 'direct', label: 'Direct and straightforward' },
      { value: 'diplomatic', label: 'Diplomatic and tactful' },
      { value: 'passive', label: 'Passive or indirect' },
      { value: 'aggressive', label: 'Aggressive or confrontational' },
      { value: 'varies', label: 'Varies by situation' },
    ]},
    { id: 'pers_conflict_style', text: 'How does the character handle conflict?', type: 'radio', options: [
      { value: 'confrontational', label: 'Confronts it head-on' },
      { value: 'avoidant', label: 'Avoids it' },
      { value: 'mediator', label: 'Tries to mediate' },
      { value: 'manipulative', label: 'Uses manipulation' },
      { value: 'compromising', label: 'Seeks compromise' },
    ]},
    { id: 'pers_decision_making', text: 'How does the character make decisions?', type: 'radio', options: [
      { value: 'logical', label: 'Logical and analytical' },
      { value: 'emotional', label: 'Emotional and intuitive' },
      { value: 'impulsive', label: 'Impulsive' },
      { value: 'cautious', label: 'Cautious and deliberate' },
      { value: 'seeks_advice', label: 'Seeks advice from others' },
    ]},
    { id: 'pers_trust', text: 'How easily does the character trust others?', type: 'radio', options: [
      { value: 'very_trusting', label: 'Very trusting' },
      { value: 'somewhat_trusting', label: 'Somewhat trusting' },
      { value: 'cautious', label: 'Cautious' },
      { value: 'distrustful', label: 'Distrustful' },
      { value: 'paranoid', label: 'Paranoid' },
    ]},
    { id: 'pers_humor', text: 'What is the character\'s sense of humor like?', type: 'radio', options: [
      { value: 'witty', label: 'Witty and clever' },
      { value: 'sarcastic', label: 'Sarcastic' },
      { value: 'silly', label: 'Silly and playful' },
      { value: 'dark', label: 'Dark humor' },
      { value: 'dry', label: 'Dry humor' },
      { value: 'none', label: 'No sense of humor' },
    ]},
    { id: 'pers_emotional_expression', text: 'How does the character express emotions?', type: 'radio', options: [
      { value: 'openly', label: 'Openly and freely' },
      { value: 'reserved', label: 'Reserved and controlled' },
      { value: 'explosive', label: 'Explosive outbursts' },
      { value: 'suppressed', label: 'Suppresses emotions' },
      { value: 'selective', label: 'Selective (only with certain people)' },
    ]},
    { id: 'pers_social_energy', text: 'What energizes the character socially?', type: 'radio', options: [
      { value: 'large_groups', label: 'Large groups and parties' },
      { value: 'small_groups', label: 'Small intimate gatherings' },
      { value: 'one_on_one', label: 'One-on-one interactions' },
      { value: 'solitude', label: 'Solitude and alone time' },
      { value: 'varies', label: 'Varies by mood' },
    ]},
    { id: 'pers_change_attitude', text: 'How does the character respond to change?', type: 'radio', options: [
      { value: 'embraces', label: 'Embraces it eagerly' },
      { value: 'adapts', label: 'Adapts well' },
      { value: 'resistant', label: 'Resistant' },
      { value: 'anxious', label: 'Becomes anxious' },
      { value: 'depends', label: 'Depends on the change' },
    ]},
  ],
};
