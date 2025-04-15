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
          ? `/logos/${team}.png`
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
                } Wins!`
            : `${
                gameState.currentPlayer === "X"
                  ? gameState.player1
                  : gameState.player2
              }'s Turn`}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
          <Button onClick={resetGame} variant="outline">
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
