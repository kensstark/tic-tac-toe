import { GameState } from "./types";

export function handleNBAGame(
  currentState: GameState,
  setGameState: (state: GameState) => void,
  setShowConfetti: (show: boolean) => void,
  setShowSeriesComplete: (show: boolean) => void
) {
  if (!currentState.seriesScore) return;

  const newSeriesScore = { ...currentState.seriesScore };

  // Only update wins if there's a winner (not a draw)
  if (currentState.winner === "X") {
    newSeriesScore.player1Wins += 1;
    newSeriesScore.currentGame += 1;
  } else if (currentState.winner === "O") {
    newSeriesScore.player2Wins += 1;
    newSeriesScore.currentGame += 1;
  }

  // Check if series is complete (first to 4 wins)
  if (newSeriesScore.player1Wins === 4 || newSeriesScore.player2Wins === 4) {
    setShowConfetti(true);
    setShowSeriesComplete(true);
    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  }

  // Start new game with updated series score
  setGameState({
    ...currentState,
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    seriesScore: newSeriesScore,
  });
}

export function isNBASeriesComplete(state: GameState) {
  return (
    state.mode === "nba" &&
    state.seriesScore &&
    (state.seriesScore.player1Wins === 4 || state.seriesScore.player2Wins === 4)
  );
}

export function restartNBASeries(
  gameState: GameState,
  setGameState: (state: GameState) => void
) {
  setGameState({
    ...gameState,
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    seriesScore: {
      player1Wins: 0,
      player2Wins: 0,
      currentGame: 1,
    },
  });
}

export function startNewNBASeries(
  gameState: GameState,
  setGameState: (state: GameState) => void
) {
  setGameState({
    ...gameState,
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    seriesScore: {
      player1Wins: 0,
      player2Wins: 0,
      currentGame: 1,
    },
  });
}
