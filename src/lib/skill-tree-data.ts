export type SkillType = 'passive' | 'augment' | 'capstone';

export interface Skill {
  id: string;
  name: string;
  description: string;
  row: number;
  type: SkillType;
  maxPoints: number;
}

export interface SkillTreeData {
  name: string;
  skills: Skill[];
}

export interface CharacterData {
  id: string;
  name: string;
  trees: {
    green: SkillTreeData;
    red: SkillTreeData;
    blue: SkillTreeData;
  };
}

const generateSkills = (charPrefix: string, treePrefix: string): Skill[] => {
  let skills: Skill[] = [];
  const structure: { [key: number]: { [key in SkillType]?: number } } = {
    1: { passive: 4 },
    2: { passive: 3, augment: 2 },
    3: { passive: 4 },
    4: { passive: 6, augment: 3 },
    5: { passive: 9 },
    6: { passive: 3, capstone: 3 },
  };

  let skillCounter = 1;

  for (const row of Object.keys(structure).map(Number)) {
    const rowContent = structure[row as keyof typeof structure];
    for (const type in rowContent) {
      const count = rowContent[type as keyof typeof rowContent]!;
      for (let i = 0; i < count; i++) {
        const skillType = type as SkillType;
        let maxPoints = 5; // Default for passive
        if (skillType === 'augment' || skillType === 'capstone') {
          maxPoints = 1;
        }
        
        skills.push({
          id: `${charPrefix}-${treePrefix}-s${skillCounter++}`,
          name: `${skillType.charAt(0).toUpperCase() + skillType.slice(1)} Skill ${skillCounter -1}`,
          description: `Placeholder description for a ${skillType} skill in row ${row}.`,
          row: row,
          type: skillType,
          maxPoints: maxPoints,
        });
      }
    }
  }
  return skills;
};

const generateCharacterData = (id: string, name: string): CharacterData => ({
  id: id,
  name: name,
  trees: {
    green: {
      name: 'Green Tree',
      skills: generateSkills(id, 'green'),
    },
    red: {
      name: 'Red Tree',
      skills: generateSkills(id, 'red'),
    },
    blue: {
      name: 'Blue Tree',
      skills: generateSkills(id, 'blue'),
    },
  },
});

export const characters: CharacterData[] = [
  generateCharacterData('amon', 'Amon'),
  generateCharacterData('vex', 'Vex'),
  generateCharacterData('rafa', 'Rafa'),
  generateCharacterData('harlowe', 'Harlowe'),
];
