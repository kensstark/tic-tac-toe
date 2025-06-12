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
  player1: string;
  player2: string;
  mode: GameMode;
  player1Team?: string;
  player2Team?: string;
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
          src={`/logos/nba/${gameState.player1Team}.png`}
          alt={gameState.player1Team || ""}
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
        <span className="text-lg font-bold">
          {gameState.seriesScore.player1Wins}
        </span>
      </div>
      <div className="text-sm text-gray-500">
        Game {gameState.seriesScore.currentGame} of 7
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">
          {gameState.seriesScore.player2Wins}
        </span>
        <Image
          src={`/logos/nba/${gameState.player2Team}.png`}
          alt={gameState.player2Team || ""}
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
    gameState.seriesScore?.player1Wins === 4
      ? gameState.player1
      : gameState.seriesScore?.player2Wins === 4
      ? gameState.player2
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
            <p className="text-gray-500">
              {gameState.seriesScore?.player1Wins} -{" "}
              {gameState.seriesScore?.player2Wins}
            </p>
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

  const handleStartGame = (
    player1: string,
    player2: string,
    mode: GameMode
  ) => {
    if (mode === "f1" || mode === "nba") {
      setShowTeamSelection(true);
      setGameState({
        board: Array(9).fill(null),
        currentPlayer: "X",
        winner: null,
        player1,
        player2,
        mode,
        seriesScore:
          mode === "nba"
            ? {
                player1Wins: 0,
                player2Wins: 0,
                currentGame: 1,
              }
            : undefined,
      });
    } else {
      setGameState({
        board: Array(9).fill(null),
        currentPlayer: "X",
        winner: null,
        player1,
        player2,
        mode,
      });
    }
  };

  const handleTeamSelection = (player1Team: string, player2Team: string) => {
    if (gameState) {
      setGameState({
        ...gameState,
        player1Team,
        player2Team,
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
    if (currentState.mode === "nba" && currentState.seriesScore) {
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

    // If there's a winner and we're in NBA mode, start the next game after a short delay
    if (winner && gameState.mode === "nba") {
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
          player1={gameState.player1}
          player2={gameState.player2}
          onConfirm={handleTeamSelection}
        />
      );
    } else if (gameState.mode === "nba") {
      return (
        <NBATeamSelection
          player1={gameState.player1}
          player2={gameState.player2}
          onConfirm={handleTeamSelection}
        />
      );
    }
  }

  const renderCell = (index: number) => {
    const value = gameState.board[index];
    if (!value) return null;

    if (gameState.mode === "f1" || gameState.mode === "nba") {
      const team =
        value === "X" ? gameState.player1Team : gameState.player2Team;
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
                : `${
                    gameState.winner === "X"
                      ? gameState.player1
                      : gameState.player2
                  } Wins Game ${
                    gameState.mode === "nba" && gameState.seriesScore
                      ? gameState.seriesScore.currentGame
                      : ""
                  }!`
              : `${
                  gameState.currentPlayer === "X"
                    ? gameState.player1
                    : gameState.player2
                }'s Turn`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameState.mode === "nba" && <SeriesScore gameState={gameState} />}
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
