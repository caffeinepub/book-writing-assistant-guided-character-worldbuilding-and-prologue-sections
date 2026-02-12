export interface WorkspaceMenuItem {
  id: string;
  label: string;
  icon: string;
  group: 'genres' | 'tools';
}

export const workspaceMenuItems: WorkspaceMenuItem[] = [
  // Book Boyfriend Genres
  {
    id: 'dark-romance',
    label: 'Dark Romance',
    icon: 'Moon',
    group: 'genres',
  },
  {
    id: 'romance',
    label: 'Romance',
    icon: 'Heart',
    group: 'genres',
  },
  {
    id: 'romantasy',
    label: 'Romantasy',
    icon: 'Sparkles',
    group: 'genres',
  },
  {
    id: 'rom-com',
    label: 'Rom-Com',
    icon: 'Laugh',
    group: 'genres',
  },
  {
    id: 'thriller',
    label: 'Thriller',
    icon: 'Zap',
    group: 'genres',
  },
  {
    id: 'psychological',
    label: 'Psychological Thriller',
    icon: 'Brain',
    group: 'genres',
  },
  {
    id: 'fanfiction',
    label: 'Fanfiction',
    icon: 'BookHeart',
    group: 'genres',
  },
  {
    id: 'music',
    label: 'Music',
    icon: 'Music',
    group: 'genres',
  },
  // Writing Tools
  {
    id: 'characters',
    label: 'Book Boyfriends',
    icon: 'Users',
    group: 'tools',
  },
  {
    id: 'worldbuilding',
    label: 'Their World',
    icon: 'Globe',
    group: 'tools',
  },
  {
    id: 'prologue',
    label: 'First Encounter',
    icon: 'FileText',
    group: 'tools',
  },
];
