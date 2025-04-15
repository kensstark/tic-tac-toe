"use client";

import { useState } from "react";
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
  player1: string;
  player2: string;
  onConfirm: (player1Team: string, player2Team: string) => void;
}

export function TeamSelection({
  player1,
  player2,
  onConfirm,
}: TeamSelectionProps) {
  const [selectedTeam1, setSelectedTeam1] = useState<string | null>(null);
  const [selectedTeam2, setSelectedTeam2] = useState<string | null>(null);

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

  const handleTeamSelect = (teamId: string, player: "player1" | "player2") => {
    if (player === "player1") {
      setSelectedTeam1(teamId);
    } else {
      setSelectedTeam2(teamId);
    }
  };

  const handleConfirm = () => {
    if (selectedTeam1 && selectedTeam2) {
      onConfirm(selectedTeam1, selectedTeam2);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Select Your Teams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{player1}'s Team</h3>
            <div className="grid grid-cols-2 gap-4">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team.id, "player1")}
                  className={cn(
                    "p-4 border rounded-lg transition-all",
                    selectedTeam1 === team.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary",
                    selectedTeam2 === team.id && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={selectedTeam2 === team.id}
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{player2}'s Team</h3>
            <div className="grid grid-cols-2 gap-4">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamSelect(team.id, "player2")}
                  className={cn(
                    "p-4 border rounded-lg transition-all",
                    selectedTeam2 === team.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary",
                    selectedTeam1 === team.id && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={selectedTeam1 === team.id}
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
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleConfirm}
            disabled={!selectedTeam1 || !selectedTeam2}
            className="w-full max-w-xs"
          >
            Confirm Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
