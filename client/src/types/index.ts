export interface Player {
  playerId: string;
  playerName: string;
  score: number;
}

export interface GameState {
  players: Player[]
  round: number
  isRoundActive: boolean
}

export type GameStartPayload = {
  message: string;
  duration: number;
  countdownStart: number;
  totalRounds: number;
};

export type NewRoundPayload = {
  round: number;
  totalRounds: number;
  duration: number;
  countdownStart: number;
};

export type RoundResultPayload = {
  round: number;
  winnerId: string;
  winnerName: string;
  scores: Player[];
  duration: number;
  countdownStart: number;
};

export type GamePausedPayload = {
  message: string;
  minPlayers: number;
  currentPlayers: Player[];
};

export type GameOverPayload = {
  finalScores: Player[];
  winners: Player[];
};

export interface CountdownTimerProps {
  duration: number
  startTime: number
  messageTemplate?: string | null
}
