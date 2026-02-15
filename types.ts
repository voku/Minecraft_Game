export type Player = 'P1' | 'P2';

export interface Position {
  x: number;
  y: number;
}

export type GameStage = 'menu' | 'intro' | 'labyrinth' | 'portal' | 'tnt' | 'winner';

export interface Score {
  P1: number;
  P2: number;
}

export const COLORS = {
  P1: 'bg-blue-500',
  P1_TEXT: 'text-blue-500',
  P1_BORDER: 'border-blue-500',
  P2: 'bg-red-500',
  P2_TEXT: 'text-red-500',
  P2_BORDER: 'border-red-500',
};