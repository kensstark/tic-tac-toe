"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { WelcomeScreen } from "./welcome-screen";
import { TeamSelection } from "./team-selection";
import { NBATeamSelection } from "./nba-team-selection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dynamically import the Confetti component with SSR disabled
const Confetti = dynamic(
  () => import("react-confetti").then((mod) => mod.default),
  {
    ssr: false,
  }
);

type GameMode = "normal" | "f1" | "nba";
type Player = "X" | "O";
type CellValue = Player | null;

interface GameState {
  board: CellValue[];
  currentPlayer: Player;
  winner: Player | "draw" | null;
  players: string[];
  playerTeams: string[];
  mode: GameMode;
  currentGameIndex?: number;
  tournamentState?: {
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
  };
  seriesScore?: {
    player1Wins: number;
    player2Wins: number;
    currentGame: number;
  };
}

// Square component represents a single cell in the game
function Square({
  value,
  onSquareClick,
}: {
  value: string | null;
  onSquareClick: () => void;
}) {
  return (
    <button
      className={`h-16 w-16 border border-gray-400 flex items-center justify-center text-2xl font-bold hover:bg-gray-100 transition-colors ${
        value === "X"
          ? "bg-green-200 hover:bg-green-300 text-green-800"
          : value === "O"
          ? "bg-blue-200 hover:bg-blue-300 text-blue-800"
          : "bg-white"
      }`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// Result popup component
function ResultPopup({ result }: { result: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div
        className={`px-8 py-6 rounded-lg shadow-lg ${
          result.includes("X")
            ? "bg-green-500 text-white"
            : result.includes("O")
            ? "bg-blue-500 text-white"
            : "bg-gray-700 text-white"
        }`}
      >
        <h2 className="text-3xl font-bold text-center">{result}</h2>
      </div>
    </motion.div>
  );
}

// Add SeriesScore component after ResultPopup
function SeriesScore({ gameState }: { gameState: GameState }) {
  if (gameState.mode !== "nba" || !gameState.seriesScore) return null;

  return (
    <div className="flex justify-between items-center mb-4 px-4">
      <div className="flex items-center gap-2">
        <Image
          src={`/logos/nba/${gameState.playerTeams[0]}.png`}
          alt={gameState.playerTeams[0] || ""}
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
        <span className="text-lg font-bold">
          {gameState.seriesScore.player1Wins}
        </span>
      </div>
      <div className="text-sm text-gray-500">vs</div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">
          {gameState.seriesScore.player2Wins}
        </span>
        <Image
          src={`/logos/nba/${gameState.playerTeams[1]}.png`}
          alt={gameState.playerTeams[1] || ""}
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
      </div>
    </div>
  );
}

// Add SeriesComplete component after SeriesScore
function SeriesComplete({
  gameState,
  onRestartSeries,
  onNewSeries,
  onNewGame,
}: {
  gameState: GameState;
  onRestartSeries: () => void;
  onNewSeries: () => void;
  onNewGame: () => void;
}) {
  const seriesWinner =
    gameState.mode === "nba" && gameState.seriesScore
      ? gameState.seriesScore.player1Wins === 4
        ? gameState.players[0]
        : gameState.seriesScore.player2Wins === 4
        ? gameState.players[1]
        : null
      : gameState.mode === "f1" && gameState.tournamentState
      ? gameState.players[
          gameState.tournamentState.playerWins.indexOf(
            Math.max(...gameState.tournamentState.playerWins)
          )
        ]
      : null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
    >
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Series Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">
              {seriesWinner} wins the series!
            </h3>
            {gameState.mode === "nba" && gameState.seriesScore && (
              <p className="text-gray-500">
                {gameState.seriesScore.player1Wins} -{" "}
                {gameState.seriesScore.player2Wins}
              </p>
            )}
            {gameState.mode === "f1" && gameState.tournamentState && (
              <div className="space-y-2">
                <p className="text-gray-500">Final Standings:</p>
                <div className="grid grid-cols-2 gap-2">
                  {gameState.players.map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{player}</span>
                      <span className="font-bold">
                        {gameState.tournamentState?.playerWins[index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={onRestartSeries} className="w-full">
              Restart Series with Same Teams
            </Button>
            <Button onClick={onNewSeries} variant="outline" className="w-full">
              New Series with Different Teams
            </Button>
            <Button onClick={onNewGame} variant="ghost" className="w-full">
              New Game (Choose Mode)
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TicTacToe() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [showSeriesComplete, setShowSeriesComplete] = useState(false);

  // Get window dimensions for confetti
  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setWindowDimensions({ width, height });

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStartGame = (players: string[], mode: GameMode) => {
    if (mode === "f1" || mode === "nba") {
      setShowTeamSelection(true);
      setGameState({
        board: Array(9).fill(null),
        currentPlayer: "X",
        winner: null,
        players,
        playerTeams: [],
        mode,
        ...(mode === "f1" && {
          tournamentState: {
            matches: generateMatches(players.length),
            currentMatchIndex: 0,
            playerWins: Array(players.length).fill(0),
            isTiebreaker: false,
            tiebreakerPlayers: [],
          },
        }),
      });
    } else {
      setGameState({
        board: Array(9).fill(null),
        currentPlayer: "X",
        winner: null,
        players: [players[0], players[1]],
        playerTeams: [],
        mode,
      });
    }
  };

  const generateMatches = (numPlayers: number) => {
    const matches: Array<{
      player1: number;
      player2: number;
      player1Wins: number;
      player2Wins: number;
      completed: boolean;
    }> = [];

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
  };

  const handleTeamSelection = (playerTeams: string[]) => {
    if (gameState) {
      setGameState({
        ...gameState,
        playerTeams,
      });
      setShowTeamSelection(false);
    }
  };

  const calculateWinner = (squares: CellValue[]): Player | "draw" | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a] as Player;
      }
    }

    return squares.includes(null) ? null : "draw";
  };

  // Add function to check if series is complete
  const isSeriesComplete = (state: GameState) => {
    return (
      state.mode === "nba" &&
      state.seriesScore &&
      (state.seriesScore.player1Wins === 4 ||
        state.seriesScore.player2Wins === 4)
    );
  };

  // Add function to restart series with same teams
  const handleRestartSeries = () => {
    if (gameState) {
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
      setShowSeriesComplete(false);
      setShowConfetti(false);
    }
  };

  // Add function to start new series
  const handleNewSeries = () => {
    if (gameState) {
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
      setShowTeamSelection(true);
      setShowSeriesComplete(false);
      setShowConfetti(false);
    }
  };

  // Add function to start new game
  const handleNewGame = () => {
    setGameState(null);
    setShowTeamSelection(false);
    setShowSeriesComplete(false);
    setShowConfetti(false);
  };

  // Modify startNextGame to check for series completion
  const startNextGame = (currentState: GameState) => {
    if (currentState.mode === "f1" && currentState.tournamentState) {
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
        if (
          tournamentState.currentMatchIndex >= tournamentState.matches.length
        ) {
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
    } else if (currentState.mode === "nba" && currentState.seriesScore) {
      const newSeriesScore = { ...currentState.seriesScore };

      if (currentState.winner === "X") {
        newSeriesScore.player1Wins += 1;
      } else if (currentState.winner === "O") {
        newSeriesScore.player2Wins += 1;
      }

      // Only increment game number if there's a winner (not a draw)
      if (currentState.winner !== "draw") {
        newSeriesScore.currentGame += 1;
      }

      // Check if series is complete
      if (
        newSeriesScore.player1Wins === 4 ||
        newSeriesScore.player2Wins === 4
      ) {
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
  };

  const generateTiebreakerMatches = (players: number[]) => {
    const matches: Array<{
      player1: number;
      player2: number;
      player1Wins: number;
      player2Wins: number;
      completed: boolean;
    }> = [];

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
  };

  const handleClick = (index: number) => {
    if (!gameState || gameState.winner || gameState.board[index]) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const winner = calculateWinner(newBoard);

    setGameState({
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
      winner,
    });

    // If there's a winner and we're in F1 mode, start the next game after a short delay
    if (winner && gameState.mode === "f1") {
      setTimeout(() => {
        startNextGame({
          ...gameState,
          board: newBoard,
          currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
          winner,
        });
      }, 1500); // 1.5 second delay to show the winner
    }
  };

  const resetGame = () => {
    setGameState(null);
    setShowTeamSelection(false);
  };

  if (!gameState) {
    return <WelcomeScreen onStart={handleStartGame} />;
  }

  if (showTeamSelection) {
    if (gameState.mode === "f1") {
      return (
        <TeamSelection
          players={gameState.players}
          onConfirm={handleTeamSelection}
        />
      );
    } else if (gameState.mode === "nba") {
      return (
        <NBATeamSelection
          player1={gameState.players[0]}
          player2={gameState.players[1]}
          onConfirm={(player1Team, player2Team) =>
            handleTeamSelection([player1Team, player2Team])
          }
        />
      );
    }
  }

  const renderCell = (index: number) => {
    const value = gameState.board[index];
    if (!value) return null;

    if (gameState.mode === "f1" || gameState.mode === "nba") {
      const teamIndex =
        value === "X"
          ? gameState.mode === "f1" && gameState.tournamentState
            ? gameState.tournamentState.matches[
                gameState.tournamentState.currentMatchIndex
              ].player1
            : 0
          : gameState.mode === "f1" && gameState.tournamentState
          ? gameState.tournamentState.matches[
              gameState.tournamentState.currentMatchIndex
            ].player2
          : 1;
      const team = gameState.playerTeams[teamIndex];
      const logoPath =
        gameState.mode === "f1"
          ? `/logos/f1/${team}.png`
          : `/logos/nba/${team}.png`;
      return (
        <Image
          src={logoPath}
          alt={value}
          width={80}
          height={80}
          className="w-full h-full object-contain"
        />
      );
    }

    return <span className="text-4xl font-bold">{value}</span>;
  };

  const getCurrentPlayers = () => {
    if (!gameState) return { player1: "", player2: "" };

    if (gameState.mode === "f1" && gameState.tournamentState) {
      const currentMatch =
        gameState.tournamentState.matches[
          gameState.tournamentState.currentMatchIndex
        ];
      return {
        player1: gameState.players[currentMatch.player1],
        player2: gameState.players[currentMatch.player2],
      };
    }

    return {
      player1: gameState.players[0],
      player2: gameState.players[1],
    };
  };

  const { player1, player2 } = getCurrentPlayers();

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {gameState.winner
              ? gameState.winner === "draw"
                ? "It's a Draw!"
                : `${gameState.winner === "X" ? player1 : player2} Wins!`
              : `${gameState.currentPlayer === "X" ? player1 : player2}'s Turn`}
          </CardTitle>
          {gameState.mode === "f1" && gameState.tournamentState && (
            <div className="text-sm text-center text-gray-500">
              {gameState.tournamentState.isTiebreaker
                ? "Tiebreaker Match"
                : `Match ${
                    gameState.tournamentState.currentMatchIndex + 1
                  } of ${gameState.tournamentState.matches.length}`}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {gameState.mode === "f1" && gameState.tournamentState && (
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Image
                    src={`/logos/f1/${
                      gameState.playerTeams[
                        gameState.tournamentState.matches[
                          gameState.tournamentState.currentMatchIndex
                        ].player1
                      ]
                    }.png`}
                    alt={player1}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                  <span className="text-lg font-bold">
                    {
                      gameState.tournamentState.playerWins[
                        gameState.tournamentState.matches[
                          gameState.tournamentState.currentMatchIndex
                        ].player1
                      ]
                    }
                  </span>
                </div>
                <div className="text-sm text-gray-500">vs</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {
                      gameState.tournamentState.playerWins[
                        gameState.tournamentState.matches[
                          gameState.tournamentState.currentMatchIndex
                        ].player2
                      ]
                    }
                  </span>
                  <Image
                    src={`/logos/f1/${
                      gameState.playerTeams[
                        gameState.tournamentState.matches[
                          gameState.tournamentState.currentMatchIndex
                        ].player2
                      ]
                    }.png`}
                    alt={player2}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 aspect-square">
            {gameState.board.map((_, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className="aspect-square border-2 border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={gameState.winner !== null}
              >
                {renderCell(index)}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={resetGame}
              variant="outline"
              className={
                gameState.mode === "nba" &&
                gameState.seriesScore &&
                gameState.seriesScore.currentGame > 7
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : ""
              }
            >
              {gameState.mode === "nba" &&
              gameState.seriesScore &&
              gameState.seriesScore.currentGame > 7
                ? "New Series"
                : "New Game"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {showSeriesComplete && gameState && (
        <SeriesComplete
          gameState={gameState}
          onRestartSeries={handleRestartSeries}
          onNewSeries={handleNewSeries}
          onNewGame={handleNewGame}
        />
      )}
    </>
  );
}
