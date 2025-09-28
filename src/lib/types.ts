export interface GearItemData {
  name: string;
  rarity: string;
  type: string;
  augments: string;
  locations: string;
  notes: string;
}

export interface Build {
  id: string;
  userId: string;
  name: string;
  characterId: string;
  skillPoints: Record<string, number>;
  gear: Record<string, GearItemData>;
  activeGear: string[];
}

export interface PublicUser {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}
