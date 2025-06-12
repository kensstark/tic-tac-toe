"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  logo: string;
}

interface TeamSelectionProps {
  players: string[];
  onConfirm: (playerTeams: string[]) => void;
}

export function TeamSelection({ players, onConfirm }: TeamSelectionProps) {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerOrder, setPlayerOrder] = useState<number[]>([]);

  const teams: Team[] = [
    { id: "mercedes", name: "Mercedes", logo: "/logos/f1/mercedes.png" },
    { id: "ferrari", name: "Ferrari", logo: "/logos/f1/ferrari.png" },
    { id: "redbull", name: "Red Bull", logo: "/logos/f1/redbull.png" },
    { id: "mclaren", name: "McLaren", logo: "/logos/f1/mclaren.png" },
    { id: "alpine", name: "Alpine", logo: "/logos/f1/alpine.png" },
    {
      id: "astonmartin",
      name: "Aston Martin",
      logo: "/logos/f1/astonmartin.png",
    },
    { id: "alfaromeo", name: "Kick Sauber", logo: "/logos/f1/alfaromeo.png" },
    { id: "haas", name: "Haas", logo: "/logos/f1/haas.png" },
    { id: "williams", name: "Williams", logo: "/logos/f1/williams.png" },
    {
      id: "racingbulls",
      name: "Racing Bulls",
      logo: "/logos/f1/racingbulls.png",
    },
  ];

  // Initialize player order randomly
  useEffect(() => {
    const order = Array.from({ length: players.length }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    setPlayerOrder(order);
  }, [players.length]);

  const handleTeamSelect = (teamId: string) => {
    if (selectedTeams.includes(teamId)) return;

    const newSelectedTeams = [...selectedTeams, teamId];
    setSelectedTeams(newSelectedTeams);

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      // All players have selected teams
      const finalTeams = new Array(players.length).fill("");
      playerOrder.forEach((playerIndex, selectionIndex) => {
        finalTeams[playerIndex] = newSelectedTeams[selectionIndex];
      });
      onConfirm(finalTeams);
    }
  };

  const currentPlayer = players[playerOrder[currentPlayerIndex]];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Select Your Teams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              {currentPlayer}'s Turn to Select Team
            </h3>
            <p className="text-sm text-gray-500">
              {currentPlayerIndex + 1} of {players.length} players
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleTeamSelect(team.id)}
                className={cn(
                  "p-4 border rounded-lg transition-all",
                  selectedTeams.includes(team.id)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-primary hover:bg-primary/5",
                  "flex flex-col items-center"
                )}
                disabled={selectedTeams.includes(team.id)}
              >
                <Image
                  src={team.logo}
                  alt={team.name}
                  width={100}
                  height={100}
                  className="w-full h-auto"
                />
                <p className="mt-2 text-center">{team.name}</p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
