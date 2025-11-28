import { TrackType } from './types';

export const TRACK_NAMES: Record<TrackType, string> = {
  [TrackType.TURF_SHORT]: 'Césped Corto',
  [TrackType.TURF_MILE]: 'Césped Milla',
  [TrackType.TURF_MEDIUM]: 'Césped Medio',
  [TrackType.TURF_LONG]: 'Césped Largo',
  [TrackType.DIRT]: 'Tierra',
};

export const TRACK_COLORS: Record<TrackType, string> = {
  [TrackType.TURF_SHORT]: '#10b981',
  [TrackType.TURF_MILE]: '#3b82f6',
  [TrackType.TURF_MEDIUM]: '#8b5cf6',
  [TrackType.TURF_LONG]: '#ec4899',
  [TrackType.DIRT]: '#f59e0b',
};
