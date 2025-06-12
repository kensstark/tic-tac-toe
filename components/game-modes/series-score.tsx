import Image from "next/image";
import { GameState } from "./types";

export function SeriesScore({ gameState }: { gameState: GameState }) {
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
      <div className="text-sm text-gray-500">
        Game {gameState.seriesScore.currentGame}
      </div>
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
