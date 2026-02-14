import type { ModuleAnswers } from './characterQuestionnaireTypes';

export function generateCharacterProfile(
  allModuleAnswers: Record<string, ModuleAnswers>,
  customInputs: Record<string, string>
): {
  name: string;
  background: string;
  motivations: string;
  relationships: string;
  flaws: string;
  voice: string;
  storyRole: string;
} {
  const coreAnswers = allModuleAnswers['core'] || {};
  const personalityAnswers = allModuleAnswers['personality'] || {};
  const styleAnswers = allModuleAnswers['style'] || {};

  // Helper to get answer with custom input fallback
  const getAnswer = (key: string): string => {
    return customInputs[key] || String(coreAnswers[key] || personalityAnswers[key] || styleAnswers[key] || '');
  };

  // Generate name
  const name = getAnswer('core_name') || 'Unnamed Character';

  // Generate background
  const backgroundParts: string[] = [];
  
  const age = getAnswer('core_age');
  const gender = getAnswer('core_gender');
  const occupation = getAnswer('core_occupation');
  const birthplace = getAnswer('core_birthplace');
  const currentLocation = getAnswer('core_current_location');
  
  if (age || gender || occupation) {
    const identityParts = [age && `${age} years old`, gender, occupation].filter(Boolean);
    backgroundParts.push(identityParts.join(', '));
  }
  
  if (birthplace) {
    backgroundParts.push(`Born in ${birthplace}`);
  }
  
  if (currentLocation && currentLocation !== birthplace) {
    backgroundParts.push(`Currently living in ${currentLocation}`);
  }

  const physicalAppearance = getAnswer('core_physical_appearance');
  if (physicalAppearance) {
    backgroundParts.push(`Physical appearance: ${physicalAppearance}`);
  }

  const familyStructure = getAnswer('family_structure');
  if (familyStructure) {
    backgroundParts.push(`Family background: ${familyStructure}`);
  }

  const childhoodHome = getAnswer('family_childhood_home');
  if (childhoodHome) {
    backgroundParts.push(`Childhood environment: ${childhoodHome}`);
  }

  const formativeExperience = getAnswer('experience_formative');
  if (formativeExperience) {
    backgroundParts.push(`Formative experience: ${formativeExperience}`);
  }

  const background = backgroundParts.join('. ') + (backgroundParts.length > 0 ? '.' : '');

  // Generate motivations
  const motivationsParts: string[] = [];
  
  const desires = getAnswer('personality_desires');
  if (desires) {
    motivationsParts.push(`Primary desire: ${desires}`);
  }

  const goals = getAnswer('current_goals');
  if (goals) {
    motivationsParts.push(`Current goals: ${goals}`);
  }

  const fears = getAnswer('personality_fears');
  if (fears) {
    motivationsParts.push(`Fears: ${fears}`);
  }

  const motivations = motivationsParts.join('. ') + (motivationsParts.length > 0 ? '.' : '');

  // Generate relationships
  const relationshipsParts: string[] = [];

  const motherRelationship = getAnswer('family_mother');
  if (motherRelationship) {
    relationshipsParts.push(`Mother: ${motherRelationship}`);
  }

  const fatherRelationship = getAnswer('family_father');
  if (fatherRelationship) {
    relationshipsParts.push(`Father: ${fatherRelationship}`);
  }

  const siblings = getAnswer('family_siblings');
  if (siblings) {
    relationshipsParts.push(`Siblings: ${siblings}`);
  }

  const currentRelationships = getAnswer('current_relationships');
  if (currentRelationships) {
    relationshipsParts.push(`Important people: ${currentRelationships}`);
  }

  const loveExperience = getAnswer('experience_love');
  if (loveExperience) {
    relationshipsParts.push(`Romantic history: ${loveExperience}`);
  }

  const relationships = relationshipsParts.join('. ') + (relationshipsParts.length > 0 ? '.' : '');

  // Generate flaws
  const flawsParts: string[] = [];

  const weaknesses = getAnswer('personality_weaknesses');
  if (weaknesses) {
    flawsParts.push(`Weaknesses: ${weaknesses}`);
  }

  const regret = getAnswer('experience_regret');
  if (regret) {
    flawsParts.push(`Biggest regret: ${regret}`);
  }

  const conflicts = getAnswer('current_conflicts');
  if (conflicts) {
    flawsParts.push(`Current conflicts: ${conflicts}`);
  }

  const betrayal = getAnswer('experience_betrayal');
  if (betrayal) {
    flawsParts.push(`Past betrayal: ${betrayal}`);
  }

  const flaws = flawsParts.join('. ') + (flawsParts.length > 0 ? '.' : '');

  // Generate voice
  const voiceParts: string[] = [];

  const communication = getAnswer('pers_communication');
  if (communication) {
    voiceParts.push(`Communication style: ${communication}`);
  }

  const voiceTone = getAnswer('style_voice_tone');
  if (voiceTone) {
    voiceParts.push(`Tone: ${voiceTone}`);
  }

  const speechPattern = getAnswer('style_speech_pattern');
  if (speechPattern) {
    voiceParts.push(`Speech patterns: ${speechPattern}`);
  }

  const humor = getAnswer('pers_humor');
  if (humor) {
    voiceParts.push(`Humor: ${humor}`);
  }

  const voice = voiceParts.join('. ') + (voiceParts.length > 0 ? '.' : '');

  // Generate story role
  const storyRoleParts: string[] = [];

  const personalityTraits = getAnswer('personality_traits');
  if (personalityTraits) {
    storyRoleParts.push(`Personality: ${personalityTraits}`);
  }

  const changeNeeded = getAnswer('current_change_needed');
  if (changeNeeded) {
    storyRoleParts.push(`Character arc: ${changeNeeded}`);
  }

  const obstacles = getAnswer('current_obstacles');
  if (obstacles) {
    storyRoleParts.push(`Obstacles: ${obstacles}`);
  }

  const moralCode = getAnswer('personality_moral_code');
  if (moralCode) {
    storyRoleParts.push(`Moral code: ${moralCode}`);
  }

  const storyRole = storyRoleParts.join('. ') + (storyRoleParts.length > 0 ? '.' : '');

  return {
    name,
    background,
    motivations,
    relationships,
    flaws,
    voice,
    storyRole,
  };
}
