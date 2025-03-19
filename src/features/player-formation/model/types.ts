import { Player } from '../../../entities/player/model/types';

export interface FormationState {
  players: Player[];
  fieldPositions: FieldPosition[];
}

export interface FieldPosition {
  id: string;
  x: number;
  y: number;
  player?: Player;
}

export interface FormationProps {
  initialPlayers: Player[];
  fieldPositions: FieldPosition[];
}
