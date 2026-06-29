/**

 * Starter collections seeded once for every newly registered account.

 * Add or adjust entries here — business logic reads this list only.

 */

export interface StarterCollectionDefinition {

  name: string;

  icon: string;

  description: string;

  color: string;

  sortOrder: number;

}



export const STARTER_COLLECTION_DEFINITIONS: readonly StarterCollectionDefinition[] = [

  {

    name: 'Learning',

    icon: 'book-open',

    description: 'Save PDFs, online courses and research notes.',

    color: '#013E37',

    sortOrder: 1,

  },

  {

    name: 'Development',

    icon: 'code',

    description: 'Store GitHub repositories, API documentation and coding notes.',

    color: '#0F524B',

    sortOrder: 2,

  },

  {

    name: 'Documents',

    icon: 'file-text',

    description: 'Keep manuals, contracts and reference PDFs.',

    color: '#013E37',

    sortOrder: 3,

  },

  {

    name: 'Reading List',

    icon: 'globe',

    description: 'Save articles and websites to revisit later.',

    color: '#FFEFB3',

    sortOrder: 4,

  },

  {

    name: 'Videos',

    icon: 'play-circle',

    description: 'Collect YouTube tutorials and lectures.',

    color: '#E6DCB0',

    sortOrder: 5,

  },

  {

    name: 'Ideas',

    icon: 'lightbulb',

    description: 'Capture thoughts, inspiration and quick notes.',

    color: '#B9C6BE',

    sortOrder: 6,

  },

  {

    name: 'Career',

    icon: 'briefcase',

    description: 'Organize resumes, interview preparation and LinkedIn research.',

    color: '#0A4A43',

    sortOrder: 7,

  },

  {

    name: 'Favorites',

    icon: 'star',

    description: 'Pin your most important knowledge for quick access.',

    color: '#0A4A43',

    sortOrder: 8,

  },

] as const;

