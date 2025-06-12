"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import { WelcomeScreen } from "./welcome-screen";
import { TeamSelection } from "./team-selection";
import { NBATeamSelection } from "./nba-team-selection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameState, Player, CellValue } from "./types";
import { SeriesScore } from "./game-modes/series-score";
import { SeriesComplete } from "./game-modes/series-complete";
import {
  handleNBAGame,
  isNBASeriesComplete,
  restartNBASeries,
  startNewNBASeries,
} from "./game-modes/nba-mode";
import {
  handleF1Game,
  isF1TournamentComplete,
  restartF1Tournament,
  startNewF1Tournament,
} from "./game-modes/f1-mode";

// Dynamically import the Confetti component with SSR disabled
const Confetti = dynamic(
  () => import("react-confetti").then((mod) => mod.default),
  {
    ssr: false,
  }
);

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

  const handleStartGame = (players: string[], mode: GameState["mode"]) => {
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
            matches: [],
            currentMatchIndex: 0,
            playerWins: Array(players.length).fill(0),
            isTiebreaker: false,
            tiebreakerPlayers: [],
          },
        }),
        ...(mode === "nba" && {
          seriesScore: {
            player1Wins: 0,
            player2Wins: 0,
            currentGame: 1,
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

  const handleRestartSeries = () => {
    if (!gameState) return;

    if (gameState.mode === "nba") {
      restartNBASeries(gameState, setGameState);
    } else if (gameState.mode === "f1") {
      restartF1Tournament(gameState, setGameState);
    }
    setShowSeriesComplete(false);
    setShowConfetti(false);
  };

  const handleNewSeries = () => {
    if (!gameState) return;

    if (gameState.mode === "nba") {
      startNewNBASeries(gameState, setGameState);
    } else if (gameState.mode === "f1") {
      startNewF1Tournament(gameState, setGameState);
    }
    setShowTeamSelection(true);
    setShowSeriesComplete(false);
    setShowConfetti(false);
  };

  const handleNewGame = () => {
    setGameState(null);
    setShowTeamSelection(false);
    setShowSeriesComplete(false);
    setShowConfetti(false);
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

    // If there's a winner, handle game progression based on mode
    if (winner) {
      setTimeout(() => {
        if (gameState.mode === "nba") {
          handleNBAGame(
            { ...gameState, board: newBoard, winner },
            setGameState,
            setShowConfetti,
            setShowSeriesComplete
          );
        } else if (gameState.mode === "f1") {
          handleF1Game(
            { ...gameState, board: newBoard, winner },
            setGameState,
            setShowConfetti,
            setShowSeriesComplete
          );
        }
      }, 1500);
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
          {gameState.mode === "nba" && <SeriesScore gameState={gameState} />}
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
