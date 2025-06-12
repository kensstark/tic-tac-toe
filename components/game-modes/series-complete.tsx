import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameState } from "../types";

interface SeriesCompleteProps {
  gameState: GameState;
  onRestartSeries: () => void;
  onNewSeries: () => void;
  onNewGame: () => void;
}

export function SeriesComplete({
  gameState,
  onRestartSeries,
  onNewSeries,
  onNewGame,
}: SeriesCompleteProps) {
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
