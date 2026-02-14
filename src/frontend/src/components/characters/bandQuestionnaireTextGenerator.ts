import type { CharacterInput } from '../../backend';

interface MemberAnswers {
  name: string;
  answers: Record<string, string>;
}

interface GroupAnswers {
  groupName: string;
  groupGenre: string;
  groupVibe: string;
}

export function generateBandCharacterText(
  member: MemberAnswers,
  groupAnswers: GroupAnswers,
  allMembers: MemberAnswers[]
): CharacterInput {
  const { name, answers } = member;

  // Generate background
  const age = answers['member-age'] || 'young-adult';
  const role = answers['member-role'] || 'vocalist';
  const roleCustom = answers['member-role-custom'] || '';
  const background = answers['member-background'] || 'self-taught';
  const backgroundCustom = answers['member-background-custom'] || '';

  const ageText = {
    teen: 'a teenager',
    'young-adult': 'in their early twenties',
    adult: 'in their late twenties to early thirties',
    mature: 'in their mid-thirties or older',
  }[age] || 'a young adult';

  const roleText = role === 'other' && roleCustom ? roleCustom : getRoleLabel(role);
  const backgroundText =
    background === 'other' && backgroundCustom ? backgroundCustom : getBackgroundLabel(background);

  const backgroundField = `${name} is ${ageText} and serves as the ${roleText} in ${groupAnswers.groupName}, a ${groupAnswers.groupGenre} group. ${name} comes from a ${backgroundText} background. ${groupAnswers.groupVibe}`;

  // Generate motivations
  const goal = answers['member-goal'] || 'art';
  const goalCustom = answers['member-goal-custom'] || '';
  const drive = answers['member-drive'] || 'passion';

  const goalText = goal === 'other' && goalCustom ? goalCustom : getGoalLabel(goal);
  const driveText = getDriveLabel(drive);

  const motivationsField = `${name}'s main goal is ${goalText}. What drives them forward is ${driveText}. This motivation shapes every decision they make within the group.`;

  // Generate relationships
  const groupDynamic = answers['member-group-dynamic'] || 'glue';
  const closest = answers['member-closest'] || 'all';

  const dynamicText = getGroupDynamicLabel(groupDynamic);
  const closestText = getClosestLabel(closest);

  const relationshipsField = `Within ${groupAnswers.groupName}, ${name} is ${dynamicText}. ${closestText}. The group dynamic is crucial to ${name}'s sense of belonging and purpose.`;

  // Generate flaws
  const flaw = answers['member-flaw'] || 'insecurity';
  const conflict = answers['member-conflict'] || 'identity';

  const flawText = getFlawLabel(flaw);
  const conflictText = getConflictLabel(conflict);

  const flawsField = `${name}'s biggest weakness is ${flawText}. They struggle internally with ${conflictText}. These challenges create tension both within themselves and with the group.`;

  // Generate voice
  const speakingStyle = answers['member-speaking-style'] || 'casual';
  const expression = answers['member-expression'] || 'open';

  const speakingText = getSpeakingStyleLabel(speakingStyle);
  const expressionText = getExpressionLabel(expression);

  const voiceField = `${name} speaks ${speakingText}. When it comes to emotions, they ${expressionText}. This communication style affects how they connect with fans and bandmates alike.`;

  // Generate story role
  const arc = answers['member-arc'] || 'growth';
  const storyRole = answers['member-story-role'] || 'support';

  const arcText = getArcLabel(arc);
  const roleStoryText = getStoryRoleLabel(storyRole);

  const storyRoleField = `In the story, ${name} serves as ${roleStoryText}. Their character arc involves ${arcText}. This journey will test their relationships and force them to confront their deepest fears.`;

  return {
    name,
    background: backgroundField,
    motivations: motivationsField,
    relationships: relationshipsField,
    flaws: flawsField,
    voice: voiceField,
    storyRole: storyRoleField,
  };
}

// Helper functions to convert answer values to readable text
function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    'lead-vocal': 'lead vocalist',
    vocalist: 'vocalist',
    rapper: 'rapper',
    dancer: 'main dancer',
    guitarist: 'guitarist',
    bassist: 'bassist',
    drummer: 'drummer',
    keyboardist: 'keyboardist',
    producer: 'producer',
    visual: 'visual and face of the group',
    leader: 'leader',
  };
  return labels[role] || 'member';
}

function getBackgroundLabel(background: string): string {
  const labels: Record<string, string> = {
    trained: 'formally trained',
    'self-taught': 'self-taught',
    street: 'street performance',
    family: 'musical family',
    discovered: 'discovered talent',
  };
  return labels[background] || 'diverse';
}

function getGoalLabel(goal: string): string {
  const labels: Record<string, string> = {
    fame: 'achieving fame and recognition',
    art: 'artistic expression and creating meaningful music',
    money: 'financial success and security',
    prove: 'proving themselves and overcoming their past',
    family: 'supporting their family and loved ones',
    change: 'changing the world and making an impact',
    fun: 'having fun and enjoying the journey',
  };
  return labels[goal] || 'finding their purpose';
}

function getDriveLabel(drive: string): string {
  const labels: Record<string, string> = {
    passion: 'their deep passion for music',
    competition: 'competition and rivalry',
    fans: 'their connection with fans',
    bandmates: 'their bond with bandmates',
    promise: 'a promise they made to someone important',
    redemption: 'seeking redemption and a second chance',
    fear: 'fear of failure and losing everything',
  };
  return labels[drive] || 'their inner drive';
}

function getGroupDynamicLabel(dynamic: string): string {
  const labels: Record<string, string> = {
    glue: 'the glue that holds everyone together',
    outsider: 'somewhat of an outsider or loner',
    mediator: 'the mediator and peacekeeper',
    troublemaker: 'the troublemaker and rebel',
    mentor: 'a mentor and big sibling figure',
    protege: 'the protégé and youngest member',
    rival: 'the competitive rival',
    heart: 'the emotional heart of the group',
  };
  return labels[dynamic] || 'an important member';
}

function getClosestLabel(closest: string): string {
  const labels: Record<string, string> = {
    all: 'They are close to everyone equally',
    one: 'They have one best friend in the group',
    few: 'They are close to a select few members',
    none: 'They keep their distance from everyone',
    outside: 'They are closer to people outside the group',
  };
  return labels[closest] || 'Their relationships vary';
}

function getFlawLabel(flaw: string): string {
  const labels: Record<string, string> = {
    ego: 'their ego and arrogance',
    insecurity: 'deep insecurity and self-doubt',
    jealousy: 'jealousy and envy',
    temper: 'their temper and anger issues',
    addiction: 'addiction and bad habits',
    trust: 'trust issues and paranoia',
    perfectionism: 'perfectionism and need for control',
    reckless: 'recklessness and impulsiveness',
  };
  return labels[flaw] || 'their personal struggles';
}

function getConflictLabel(conflict: string): string {
  const labels: Record<string, string> = {
    identity: 'questions of identity and who they really are',
    loyalty: 'the tension between loyalty and personal ambition',
    past: 'past trauma and regrets',
    pressure: 'overwhelming pressure and expectations',
    authenticity: 'the conflict between authenticity and image',
    relationships: 'balancing relationships with their career',
    burnout: 'burnout and exhaustion',
  };
  return labels[conflict] || 'internal conflicts';
}

function getSpeakingStyleLabel(style: string): string {
  const labels: Record<string, string> = {
    confident: 'with confidence and directness',
    soft: 'in a soft and gentle manner',
    sarcastic: 'with sarcasm and wit',
    formal: 'formally and politely',
    casual: 'casually with plenty of slang',
    poetic: 'poetically and lyrically',
    blunt: 'bluntly without a filter',
    quiet: 'quietly with few words',
  };
  return labels[style] || 'in their own unique way';
}

function getExpressionLabel(expression: string): string {
  const labels: Record<string, string> = {
    open: 'express themselves openly and dramatically',
    subtle: 'show emotions subtly through actions',
    music: 'channel emotions through music and performance',
    humor: 'mask feelings with humor and jokes',
    bottled: 'bottle up their emotions',
    explosive: 'have explosive emotional outbursts',
  };
  return labels[expression] || 'express themselves';
}

function getArcLabel(arc: string): string {
  const labels: Record<string, string> = {
    growth: 'personal growth and coming of age',
    redemption: 'redemption and earning a second chance',
    fall: 'a fall from grace',
    discovery: 'self-discovery and finding their identity',
    sacrifice: 'learning to sacrifice for others',
    rebellion: 'rebellion and breaking free',
    acceptance: 'acceptance and finding peace',
    static: 'remaining an unchanging anchor for others',
  };
  return labels[arc] || 'personal transformation';
}

function getStoryRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    protagonist: 'the protagonist and main character',
    deuteragonist: 'the deuteragonist and second lead',
    support: 'a supporting character',
    comic: 'comic relief',
    antagonist: 'an antagonist and source of conflict',
    mentor: 'a mentor and guide',
    catalyst: 'a catalyst who drives change',
    foil: 'a foil who contrasts with others',
  };
  return labels[role] || 'an important character';
}
