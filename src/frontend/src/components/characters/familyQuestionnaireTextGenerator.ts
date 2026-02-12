// Deterministic text generation utility for family questionnaire

import type { PersonDraft } from './multiCharacterQuestionnaireTypes';
import type { FamilyQuestionnairePersonAnswers } from './familyQuestionnaireTypes';
import { FAMILY_QUESTIONNAIRE_QUESTIONS } from './familyQuestionnaireQuestions';

interface GeneratedCharacterText {
  background: string;
  motivations: string;
  relationships: string;
  flaws: string;
  voice: string;
  storyRole: string;
}

export function generateCharacterText(
  person: PersonDraft,
  personAnswers: FamilyQuestionnairePersonAnswers,
  allPeople: PersonDraft[]
): GeneratedCharacterText {
  const answers = personAnswers.answers;

  // Helper to get answer label
  const getAnswerLabel = (questionId: string): string => {
    const answer = answers[questionId];
    if (!answer) return '';
    
    const question = FAMILY_QUESTIONNAIRE_QUESTIONS.find((q) => q.id === questionId);
    if (!question) return '';

    if (Array.isArray(answer.value)) {
      // Checkbox - multiple values
      return answer.value
        .map((val) => question.options.find((opt) => opt.value === val)?.label || val)
        .join(', ');
    } else {
      // Radio/select - single value
      const option = question.options.find((opt) => opt.value === answer.value);
      if (option?.allowCustomInput && answer.customInput) {
        return answer.customInput;
      }
      return option?.label || answer.value;
    }
  };

  // Helper to get answer value
  const getAnswerValue = (questionId: string): string | string[] => {
    return answers[questionId]?.value || '';
  };

  // Generate Background
  const ageRange = getAnswerLabel('age-range');
  const occupation = getAnswerLabel('occupation');
  const education = getAnswerLabel('education');
  const socioeconomic = getAnswerLabel('socioeconomic');
  const upbringing = getAnswerLabel('upbringing');
  const culturalBackground = getAnswerLabel('cultural-background');
  const physicalAppearance = getAnswerLabel('physical-appearance');
  const healthStatus = getAnswerLabel('health-status');

  const background = `${person.name} is a ${ageRange.toLowerCase()} ${person.gender} who works as ${occupation.toLowerCase()}. They have ${education.toLowerCase()} education and come from a ${socioeconomic.toLowerCase()} background. Their upbringing was ${upbringing.toLowerCase()}, shaped by ${culturalBackground.toLowerCase()} influences. ${physicalAppearance ? `Physically, they are ${physicalAppearance.toLowerCase()}.` : ''} Their health status is ${healthStatus.toLowerCase()}.`;

  // Generate Motivations
  const primaryGoal = getAnswerLabel('primary-goal');
  const motivationSource = getAnswerLabel('motivation-source');
  const greatestDesire = getAnswerLabel('greatest-desire');
  const greatestFear = getAnswerLabel('greatest-fear');
  const secretDream = getAnswerLabel('secret-dream');
  const values = getAnswerLabel('values');
  const lifePhilosophy = getAnswerLabel('life-philosophy');

  const motivations = `${person.name}'s primary goal in life is ${primaryGoal.toLowerCase()}. They are motivated by ${motivationSource.toLowerCase()} and desire ${greatestDesire.toLowerCase()} above all else. Their greatest fear is ${greatestFear.toLowerCase()}. Secretly, they dream of ${secretDream.toLowerCase()}. They value ${values.toLowerCase()} and approach life with a ${lifePhilosophy.toLowerCase()} philosophy.`;

  // Generate Relationships
  const relationshipStatus = getAnswerLabel('relationship-status');
  const familyDynamic = getAnswerLabel('family-dynamic');
  const friendshipCircle = getAnswerLabel('friendship-circle');
  const trustIssues = getAnswerLabel('trust-issues');
  const conflictStyle = getAnswerLabel('conflict-style');
  const communicationStyle = getAnswerLabel('communication-style');
  const socialRole = getAnswerLabel('social-role');
  const attachmentStyle = getAnswerLabel('attachment-style');

  let relationshipsText = `${person.name} is ${relationshipStatus.toLowerCase()} romantically. Their family dynamic is ${familyDynamic.toLowerCase()}, and they have ${friendshipCircle.toLowerCase()}. They are ${trustIssues.toLowerCase()} when it comes to trust. In conflicts, they are ${conflictStyle.toLowerCase()}, and they communicate in a ${communicationStyle.toLowerCase()} manner. In social groups, they typically play the role of ${socialRole.toLowerCase()}. Their attachment style is ${attachmentStyle.toLowerCase()}.`;

  // Add parent relationship if this is the main character
  if (personAnswers.isMainCharacter && personAnswers.parentIds && personAnswers.parentIds.length > 0) {
    const parents = allPeople.filter((p) => personAnswers.parentIds?.includes(p.id));
    const parentNames = parents.map((p) => p.name).join(' and ');
    const childRole = person.familyRole === 'son' ? 'son' : person.familyRole === 'daughter' ? 'daughter' : 'child';
    relationshipsText += ` As the main character, ${person.name} is the ${childRole} of ${parentNames}, which significantly shapes their story and relationships.`;
  }

  const relationships = relationshipsText;

  // Generate Flaws
  const mainFlaw = getAnswerLabel('main-flaw');
  const internalConflict = getAnswerLabel('internal-conflict');
  const externalObstacle = getAnswerLabel('external-obstacle');
  const pastTrauma = getAnswerLabel('past-trauma');
  const copingMechanism = getAnswerLabel('coping-mechanism');
  const weaknesses = getAnswerLabel('weakness');
  const growthArea = getAnswerLabel('growth-area');

  const flaws = `${person.name}'s main character flaw is ${mainFlaw.toLowerCase()}. They struggle with ${internalConflict.toLowerCase()} as their primary internal conflict. Externally, they face ${externalObstacle.toLowerCase()}. ${pastTrauma !== 'No Significant Trauma' ? `They carry trauma from ${pastTrauma.toLowerCase()}.` : ''} They cope through ${copingMechanism.toLowerCase()}. Their key weaknesses include ${weaknesses.toLowerCase()}. They need to grow in ${growthArea.toLowerCase()}.`;

  // Generate Voice
  const speechPattern = getAnswerLabel('speech-pattern');
  const vocabulary = getAnswerLabel('vocabulary');
  const emotionalExpression = getAnswerLabel('emotional-expression');
  const tone = getAnswerLabel('tone');
  const distinctivePhrase = getAnswerLabel('distinctive-phrase');

  const voice = `${person.name} speaks in a ${speechPattern.toLowerCase()} manner with ${vocabulary.toLowerCase()} vocabulary. They express emotions ${emotionalExpression.toLowerCase()} and typically have a ${tone.toLowerCase()} tone. ${distinctivePhrase !== 'No distinctive pattern' ? `They have ${distinctivePhrase.toLowerCase()}.` : ''}`;

  // Generate Story Role
  const narrativeRole = getAnswerLabel('narrative-role');
  const characterArc = getAnswerLabel('character-arc');
  const storyFunction = getAnswerLabel('story-function');
  const relationshipToMC = getAnswerLabel('relationship-to-mc');
  const storyImpact = getAnswerLabel('story-impact');
  const transformation = getAnswerLabel('transformation');

  let storyRoleText = `${person.name} serves as ${narrativeRole.toLowerCase()} in the story. They will experience ${characterArc.toLowerCase()}. Their functions in the plot include: ${storyFunction.toLowerCase()}. They are ${relationshipToMC.toLowerCase()} to the main character and have ${storyImpact.toLowerCase()} impact on the story outcome. By the end, they will learn ${transformation.toLowerCase()}.`;

  // Add main character designation
  if (personAnswers.isMainCharacter) {
    const childRole = person.familyRole === 'son' ? 'son' : person.familyRole === 'daughter' ? 'daughter' : 'child';
    if (personAnswers.parentIds && personAnswers.parentIds.length > 0) {
      const parents = allPeople.filter((p) => personAnswers.parentIds?.includes(p.id));
      const parentNames = parents.map((p) => p.name).join(' and ');
      storyRoleText += ` As the main character and ${childRole} of ${parentNames}, their journey is central to the narrative.`;
    } else {
      storyRoleText += ` As the main character, their journey is central to the narrative.`;
    }
  }

  const storyRole = storyRoleText;

  return {
    background,
    motivations,
    relationships,
    flaws,
    voice,
    storyRole,
  };
}
