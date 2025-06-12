import { GameState } from "./types";

interface Match {
  player1: number;
  player2: number;
  player1Wins: number;
  player2Wins: number;
  completed: boolean;
}

export function generateMatches(numPlayers: number): Match[] {
  const matches: Match[] = [];

  // Generate all possible pairs of players
  for (let i = 0; i < numPlayers; i++) {
    for (let j = i + 1; j < numPlayers; j++) {
      // Add two matches for each pair (home and away)
      matches.push({
        player1: i,
        player2: j,
        player1Wins: 0,
        player2Wins: 0,
        completed: false,
      });
      matches.push({
        player1: j,
        player2: i,
        player1Wins: 0,
        player2Wins: 0,
        completed: false,
      });
    }
  }

  // Shuffle the matches
  for (let i = matches.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [matches[i], matches[j]] = [matches[j], matches[i]];
  }

  return matches;
}

export function generateTiebreakerMatches(players: number[]): Match[] {
  const matches: Match[] = [];

  // Generate matches between tied players
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      matches.push({
        player1: players[i],
        player2: players[j],
        player1Wins: 0,
        player2Wins: 0,
        completed: false,
      });
    }
  }

  return matches;
}

export function handleF1Game(
  currentState: GameState,
  setGameState: (state: GameState) => void,
  setShowConfetti: (show: boolean) => void,
  setShowSeriesComplete: (show: boolean) => void
) {
  if (!currentState.tournamentState) return;

  const { tournamentState } = currentState;
  const currentMatch =
    tournamentState.matches[tournamentState.currentMatchIndex];

  if (currentState.winner === "X") {
    currentMatch.player1Wins++;
    tournamentState.playerWins[currentMatch.player1]++;
  } else if (currentState.winner === "O") {
    currentMatch.player2Wins++;
    tournamentState.playerWins[currentMatch.player2]++;
  }

  // Check if current match is complete (best of 3)
  if (currentMatch.player1Wins === 2 || currentMatch.player2Wins === 2) {
    currentMatch.completed = true;
    tournamentState.currentMatchIndex++;

    // Check if tournament is complete
    if (tournamentState.currentMatchIndex >= tournamentState.matches.length) {
      // Find players with most wins
      const maxWins = Math.max(...tournamentState.playerWins);
      const winners = tournamentState.playerWins
        .map((wins, index) => ({ wins, index }))
        .filter(({ wins }) => wins === maxWins)
        .map(({ index }) => index);

      if (winners.length === 1) {
        // We have a winner
        setShowConfetti(true);
        setShowSeriesComplete(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        // We have a tie, start tiebreaker
        tournamentState.isTiebreaker = true;
        tournamentState.tiebreakerPlayers = winners;
        tournamentState.matches = generateTiebreakerMatches(winners);
        tournamentState.currentMatchIndex = 0;
      }
    }
  }

  // Start new game
  setGameState({
    ...currentState,
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    tournamentState,
  });
}

export function isF1TournamentComplete(state: GameState) {
  return (
    state.mode === "f1" &&
    state.tournamentState &&
    state.tournamentState.currentMatchIndex >=
      state.tournamentState.matches.length
  );
}

export function restartF1Tournament(
  gameState: GameState,
  setGameState: (state: GameState) => void
) {
  if (!gameState.tournamentState) return;

  setGameState({
    ...gameState,
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    tournamentState: {
      matches: generateMatches(gameState.players.length),
      currentMatchIndex: 0,
      playerWins: Array(gameState.players.length).fill(0),
      isTiebreaker: false,
      tiebreakerPlayers: [],
    },
  });
}

export function startNewF1Tournament(
  gameState: GameState,
  setGameState: (state: GameState) => void
) {
  setGameState({
    ...gameState,
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    tournamentState: {
      matches: generateMatches(gameState.players.length),
      currentMatchIndex: 0,
      playerWins: Array(gameState.players.length).fill(0),
      isTiebreaker: false,
      tiebreakerPlayers: [],
    },
  });
}
