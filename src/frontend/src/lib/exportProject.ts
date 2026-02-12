import type { BookProjectView } from '../backend';

export function exportProject(project: BookProjectView) {
  const lines: string[] = [];

  // Title
  lines.push(`# ${project.name}`);
  lines.push('');
  lines.push(`Exported: ${new Date().toLocaleDateString()}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Book Boyfriends (Characters)
  lines.push('## Book Boyfriends & Husbands');
  lines.push('');
  if (project.characters.length === 0) {
    lines.push('_No book boyfriends yet_');
    lines.push('');
  } else {
    project.characters.forEach((character) => {
      lines.push(`### ${character.name}`);
      lines.push('');
      if (character.background) {
        lines.push('**Background & Identity:**');
        lines.push(character.background);
        lines.push('');
      }
      if (character.motivations) {
        lines.push('**Motivations & Goals:**');
        lines.push(character.motivations);
        lines.push('');
      }
      if (character.relationships) {
        lines.push('**Relationships:**');
        lines.push(character.relationships);
        lines.push('');
      }
      if (character.flaws) {
        lines.push('**Conflicts & Flaws:**');
        lines.push(character.flaws);
        lines.push('');
      }
      if (character.voice) {
        lines.push('**Voice & Dialogue:**');
        lines.push(character.voice);
        lines.push('');
      }
      if (character.storyRole) {
        lines.push('**Story Role & Arc:**');
        lines.push(character.storyRole);
        lines.push('');
      }
      lines.push('---');
      lines.push('');
    });
  }

  // Their World (Worldbuilding)
  lines.push('## Their World');
  lines.push('');
  if (project.worldbuilding.length === 0) {
    lines.push('_No worldbuilding notes yet_');
    lines.push('');
  } else {
    project.worldbuilding.forEach((category, index) => {
      const categoryNames = ['Setting', 'History', 'Culture/Society', 'Geography', 'Politics/Power', 'Rules/Systems', 'Themes/Tone'];
      const categoryName = categoryNames[index] || `Category ${index + 1}`;
      
      lines.push(`### ${categoryName}`);
      lines.push('');
      if (category.description) {
        lines.push(category.description);
        lines.push('');
      }
      if (category.freeformNotes.length > 0) {
        lines.push('**Notes:**');
        category.freeformNotes.forEach((note) => {
          lines.push(`- ${note}`);
        });
        lines.push('');
      }
    });
  }

  // First Encounter (Prologue)
  lines.push('## First Encounter');
  lines.push('');
  if (!project.prologue) {
    lines.push('_No first encounter yet_');
    lines.push('');
  } else {
    const p = project.prologue;
    if (p.hook) {
      lines.push('**Hook:**');
      lines.push(p.hook);
      lines.push('');
    }
    if (p.povVoice) {
      lines.push('**POV & Voice:**');
      lines.push(p.povVoice);
      lines.push('');
    }
    if (p.stakes) {
      lines.push('**Stakes:**');
      lines.push(p.stakes);
      lines.push('');
    }
    if (p.keyReveals) {
      lines.push('**Key Information & Reveals:**');
      lines.push(p.keyReveals);
      lines.push('');
    }
    if (p.connectionToChapterOne) {
      lines.push('**Connection to Chapter One:**');
      lines.push(p.connectionToChapterOne);
      lines.push('');
    }
    if (p.draft) {
      lines.push('### Draft');
      lines.push('');
      lines.push(p.draft);
      lines.push('');
    }
  }

  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
