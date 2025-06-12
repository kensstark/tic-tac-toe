export type GameMode = "normal" | "f1" | "nba";
export type Player = "X" | "O";
export type CellValue = Player | null;

export interface SeriesScore {
  player1Wins: number;
  player2Wins: number;
  currentGame: number;
}

export interface TournamentState {
  matches: Array<{
    player1: number;
    player2: number;
    player1Wins: number;
    player2Wins: number;
    completed: boolean;
  }>;
  currentMatchIndex: number;
  playerWins: number[];
  isTiebreaker: boolean;
  tiebreakerPlayers: number[];
}

export interface GameState {
  board: CellValue[];
  currentPlayer: Player;
  winner: Player | "draw" | null;
  players: string[];
  playerTeams: string[];
  mode: GameMode;
  currentGameIndex?: number;
  tournamentState?: TournamentState;
  seriesScore?: SeriesScore;
} 