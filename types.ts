export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface KebabPlace {
  id: string;
  name: string;
  description: string;
  uri?: string;
  rating?: string;
  address?: string;
  distance?: string; // Pre-formatted string e.g., "1.2 km"
}

export enum AppState {
  IDLE = 'IDLE',
  LOCATING = 'LOCATING',
  SEARCHING = 'SEARCHING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeId?: string;
  };
}