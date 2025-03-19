export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  overall: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  photoUrl?: string;
}

export interface Position {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface PlacedPlayer {
  positionId: string;
  player: Player;
}
