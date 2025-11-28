export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface Character {
  id: string;
  characterName: string;
  identifierVersion: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    runs: number;
  };
}

export enum TrackType {
  TURF_SHORT = 'TURF_SHORT',
  TURF_MILE = 'TURF_MILE',
  TURF_MEDIUM = 'TURF_MEDIUM',
  TURF_LONG = 'TURF_LONG',
  DIRT = 'DIRT',
}

export interface Run {
  id: string;
  characterTrainingId: string;
  trackType: TrackType;
  finalPlace: number;
  rareSkillsCount: number;
  normalSkillsCount: number;
  uniqueSkillActivated: boolean;
  goodPositioning: boolean;
  rushed: boolean;
  score: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  characterTraining?: {
    characterName: string;
    identifierVersion: string;
  };
}

export interface DashboardStats {
  overview: {
    totalRuns: number;
    averageScore: number;
    averageFinalPlace: number;
    rushedRate: number;
    uniqueSkillRate: number;
    goodPositioningRate: number;
    averageRareSkills: number;
    averageNormalSkills: number;
  };
  byTrack: Array<{
    trackType: TrackType;
    totalRuns: number;
    averageScore: number;
    averageFinalPlace: number;
    rushedRate: number;
    bestScore: number;
  }>;
  byCharacter: Array<{
    characterId: string;
    characterName: string;
    identifierVersion: string;
    totalRuns: number;
    averageScore: number;
    averageFinalPlace: number;
    rushedRate: number;
    bestScore: number;
  }>;
  recentRuns: Run[];
  bestRuns: Run[];
}
