// Question bank for Band/Group creation questionnaire

export interface BandQuestion {
  id: string;
  section: string;
  text: string;
  type: 'radio' | 'select' | 'checkbox' | 'text' | 'textarea';
  options?: Array<{ value: string; label: string; allowCustom?: boolean }>;
  placeholder?: string;
}

// Group-level questions (asked once for the entire band/group)
export const GROUP_LEVEL_QUESTIONS: BandQuestion[] = [
  {
    id: 'group-name',
    section: 'Group Setup',
    text: 'What is the name of this band/group?',
    type: 'text',
    placeholder: 'e.g., The Midnight Riders, Eclipse, Harmony Five',
  },
  {
    id: 'group-genre',
    section: 'Group Setup',
    text: 'What genre or style does this group represent?',
    type: 'radio',
    options: [
      { value: 'rock', label: 'Rock/Alternative' },
      { value: 'pop', label: 'Pop' },
      { value: 'kpop', label: 'K-Pop/J-Pop' },
      { value: 'hiphop', label: 'Hip-Hop/Rap' },
      { value: 'indie', label: 'Indie/Folk' },
      { value: 'electronic', label: 'Electronic/EDM' },
      { value: 'jazz', label: 'Jazz/Blues' },
      { value: 'metal', label: 'Metal/Punk' },
      { value: 'other', label: 'Other', allowCustom: true },
    ],
  },
  {
    id: 'group-vibe',
    section: 'Group Setup',
    text: 'What is the overall vibe or concept of this group?',
    type: 'textarea',
    placeholder: 'Describe the group\'s aesthetic, energy, and what makes them unique...',
  },
];

// Per-member questions (asked for each band/group member)
export const MEMBER_QUESTIONS: BandQuestion[] = [
  // Background section
  {
    id: 'member-age',
    section: 'Background',
    text: 'How old is this member?',
    type: 'radio',
    options: [
      { value: 'teen', label: 'Teen (13-17)' },
      { value: 'young-adult', label: 'Young Adult (18-25)' },
      { value: 'adult', label: 'Adult (26-35)' },
      { value: 'mature', label: 'Mature (36+)' },
    ],
  },
  {
    id: 'member-role',
    section: 'Background',
    text: 'What is their role in the group?',
    type: 'radio',
    options: [
      { value: 'lead-vocal', label: 'Lead Vocalist' },
      { value: 'vocalist', label: 'Vocalist/Singer' },
      { value: 'rapper', label: 'Rapper' },
      { value: 'dancer', label: 'Main Dancer' },
      { value: 'guitarist', label: 'Guitarist' },
      { value: 'bassist', label: 'Bassist' },
      { value: 'drummer', label: 'Drummer' },
      { value: 'keyboardist', label: 'Keyboardist/Pianist' },
      { value: 'producer', label: 'Producer/DJ' },
      { value: 'visual', label: 'Visual/Face of the Group' },
      { value: 'leader', label: 'Leader/Captain' },
      { value: 'other', label: 'Other', allowCustom: true },
    ],
  },
  {
    id: 'member-background',
    section: 'Background',
    text: 'What is their background before joining the group?',
    type: 'radio',
    options: [
      { value: 'trained', label: 'Formally trained/Academy graduate' },
      { value: 'self-taught', label: 'Self-taught/Natural talent' },
      { value: 'street', label: 'Street performer/Underground scene' },
      { value: 'family', label: 'Musical family/Legacy' },
      { value: 'discovered', label: 'Discovered/Scouted' },
      { value: 'other', label: 'Other', allowCustom: true },
    ],
  },
  {
    id: 'member-personality',
    section: 'Personality',
    text: 'What is their personality type in the group?',
    type: 'radio',
    options: [
      { value: 'charismatic', label: 'Charismatic/Outgoing' },
      { value: 'quiet', label: 'Quiet/Reserved' },
      { value: 'funny', label: 'Funny/Class Clown' },
      { value: 'serious', label: 'Serious/Focused' },
      { value: 'rebellious', label: 'Rebellious/Wild' },
      { value: 'caring', label: 'Caring/Motherly' },
      { value: 'competitive', label: 'Competitive/Ambitious' },
      { value: 'mysterious', label: 'Mysterious/Enigmatic' },
    ],
  },
  {
    id: 'member-strength',
    section: 'Personality',
    text: 'What is their greatest strength?',
    type: 'radio',
    options: [
      { value: 'talent', label: 'Raw talent/Skill' },
      { value: 'charisma', label: 'Stage presence/Charisma' },
      { value: 'work-ethic', label: 'Work ethic/Dedication' },
      { value: 'creativity', label: 'Creativity/Innovation' },
      { value: 'leadership', label: 'Leadership/Guidance' },
      { value: 'loyalty', label: 'Loyalty/Teamwork' },
      { value: 'adaptability', label: 'Adaptability/Versatility' },
    ],
  },
  // Motivations section
  {
    id: 'member-goal',
    section: 'Motivations',
    text: 'What is their main goal or dream?',
    type: 'radio',
    options: [
      { value: 'fame', label: 'Fame and recognition' },
      { value: 'art', label: 'Artistic expression/Creating music' },
      { value: 'money', label: 'Financial success/Security' },
      { value: 'prove', label: 'Prove themselves/Overcome past' },
      { value: 'family', label: 'Support family/Loved ones' },
      { value: 'change', label: 'Change the world/Make impact' },
      { value: 'fun', label: 'Have fun/Enjoy the ride' },
      { value: 'other', label: 'Other', allowCustom: true },
    ],
  },
  {
    id: 'member-drive',
    section: 'Motivations',
    text: 'What drives them to keep going?',
    type: 'radio',
    options: [
      { value: 'passion', label: 'Passion for music' },
      { value: 'competition', label: 'Competition/Rivalry' },
      { value: 'fans', label: 'Fans/Audience connection' },
      { value: 'bandmates', label: 'Bandmates/Friendship' },
      { value: 'promise', label: 'Promise to someone' },
      { value: 'redemption', label: 'Redemption/Second chance' },
      { value: 'fear', label: 'Fear of failure/Losing everything' },
    ],
  },
  // Relationships section
  {
    id: 'member-group-dynamic',
    section: 'Relationships',
    text: 'How do they relate to the rest of the group?',
    type: 'radio',
    options: [
      { value: 'glue', label: 'The glue that holds everyone together' },
      { value: 'outsider', label: 'The outsider/Loner' },
      { value: 'mediator', label: 'The mediator/Peacekeeper' },
      { value: 'troublemaker', label: 'The troublemaker/Rebel' },
      { value: 'mentor', label: 'The mentor/Big sibling' },
      { value: 'protege', label: 'The protégé/Youngest' },
      { value: 'rival', label: 'The rival/Competitive one' },
      { value: 'heart', label: 'The heart/Emotional center' },
    ],
  },
  {
    id: 'member-closest',
    section: 'Relationships',
    text: 'Who are they closest to?',
    type: 'radio',
    options: [
      { value: 'all', label: 'Close to everyone equally' },
      { value: 'one', label: 'One specific member (best friend)' },
      { value: 'few', label: 'A few select members' },
      { value: 'none', label: 'Keeps distance from everyone' },
      { value: 'outside', label: 'Closer to people outside the group' },
    ],
  },
  // Flaws section
  {
    id: 'member-flaw',
    section: 'Flaws',
    text: 'What is their biggest flaw or weakness?',
    type: 'radio',
    options: [
      { value: 'ego', label: 'Ego/Arrogance' },
      { value: 'insecurity', label: 'Insecurity/Self-doubt' },
      { value: 'jealousy', label: 'Jealousy/Envy' },
      { value: 'temper', label: 'Temper/Anger issues' },
      { value: 'addiction', label: 'Addiction/Bad habits' },
      { value: 'trust', label: 'Trust issues/Paranoia' },
      { value: 'perfectionism', label: 'Perfectionism/Control freak' },
      { value: 'reckless', label: 'Recklessness/Impulsiveness' },
    ],
  },
  {
    id: 'member-conflict',
    section: 'Flaws',
    text: 'What internal conflict do they struggle with?',
    type: 'radio',
    options: [
      { value: 'identity', label: 'Identity/Who they really are' },
      { value: 'loyalty', label: 'Loyalty vs. personal ambition' },
      { value: 'past', label: 'Past trauma/Regrets' },
      { value: 'pressure', label: 'Pressure/Expectations' },
      { value: 'authenticity', label: 'Authenticity vs. image' },
      { value: 'relationships', label: 'Relationships vs. career' },
      { value: 'burnout', label: 'Burnout/Exhaustion' },
    ],
  },
  // Voice section
  {
    id: 'member-speaking-style',
    section: 'Voice',
    text: 'How do they speak?',
    type: 'radio',
    options: [
      { value: 'confident', label: 'Confident and direct' },
      { value: 'soft', label: 'Soft and gentle' },
      { value: 'sarcastic', label: 'Sarcastic/Witty' },
      { value: 'formal', label: 'Formal/Polite' },
      { value: 'casual', label: 'Casual/Slang-heavy' },
      { value: 'poetic', label: 'Poetic/Lyrical' },
      { value: 'blunt', label: 'Blunt/No filter' },
      { value: 'quiet', label: 'Quiet/Few words' },
    ],
  },
  {
    id: 'member-expression',
    section: 'Voice',
    text: 'How do they express emotions?',
    type: 'radio',
    options: [
      { value: 'open', label: 'Openly and dramatically' },
      { value: 'subtle', label: 'Subtly/Through actions' },
      { value: 'music', label: 'Through music/Performance' },
      { value: 'humor', label: 'Through humor/Jokes' },
      { value: 'bottled', label: 'Bottles them up' },
      { value: 'explosive', label: 'Explosive outbursts' },
    ],
  },
  // Story Role section
  {
    id: 'member-arc',
    section: 'Story Role',
    text: 'What is their character arc?',
    type: 'radio',
    options: [
      { value: 'growth', label: 'Growth/Coming of age' },
      { value: 'redemption', label: 'Redemption/Second chance' },
      { value: 'fall', label: 'Fall from grace/Corruption' },
      { value: 'discovery', label: 'Self-discovery/Finding identity' },
      { value: 'sacrifice', label: 'Sacrifice/Putting others first' },
      { value: 'rebellion', label: 'Rebellion/Breaking free' },
      { value: 'acceptance', label: 'Acceptance/Finding peace' },
      { value: 'static', label: 'Static/Unchanging anchor' },
    ],
  },
  {
    id: 'member-story-role',
    section: 'Story Role',
    text: 'What role do they play in the story?',
    type: 'radio',
    options: [
      { value: 'protagonist', label: 'Protagonist/Main character' },
      { value: 'deuteragonist', label: 'Deuteragonist/Second lead' },
      { value: 'support', label: 'Supporting character' },
      { value: 'comic', label: 'Comic relief' },
      { value: 'antagonist', label: 'Antagonist/Source of conflict' },
      { value: 'mentor', label: 'Mentor/Guide' },
      { value: 'catalyst', label: 'Catalyst/Drives change' },
      { value: 'foil', label: 'Foil/Contrast to others' },
    ],
  },
];
