"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Team {
  id: string;
  name: string;
  logo: string;
  conference: "east" | "west";
}

interface NBATeamSelectionProps {
  player1: string;
  player2: string;
  onConfirm: (player1Team: string, player2Team: string) => void;
}

export function NBATeamSelection({
  player1,
  player2,
  onConfirm,
}: NBATeamSelectionProps) {
  const [selectedTeam1, setSelectedTeam1] = useState<string | null>(null);
  const [selectedTeam2, setSelectedTeam2] = useState<string | null>(null);
  const [conference1, setConference1] = useState<"east" | "west">("east");
  const [conference2, setConference2] = useState<"east" | "west">("west");

  const teams: Team[] = [
    // Eastern Conference
    {
      id: "celtics",
      name: "Boston Celtics",
      logo: "/logos/nba/celtics.png",
      conference: "east",
    },
    {
      id: "nets",
      name: "Brooklyn Nets",
      logo: "/logos/nba/nets.png",
      conference: "east",
    },
    {
      id: "knicks",
      name: "New York Knicks",
      logo: "/logos/nba/knicks.png",
      conference: "east",
    },
    {
      id: "76ers",
      name: "Philadelphia 76ers",
      logo: "/logos/nba/76ers.png",
      conference: "east",
    },
    {
      id: "raptors",
      name: "Toronto Raptors",
      logo: "/logos/nba/raptors.png",
      conference: "east",
    },
    {
      id: "bulls",
      name: "Chicago Bulls",
      logo: "/logos/nba/bulls.png",
      conference: "east",
    },
    {
      id: "cavaliers",
      name: "Cleveland Cavaliers",
      logo: "/logos/nba/cavaliers.png",
      conference: "east",
    },
    {
      id: "pistons",
      name: "Detroit Pistons",
      logo: "/logos/nba/pistons.png",
      conference: "east",
    },
    {
      id: "pacers",
      name: "Indiana Pacers",
      logo: "/logos/nba/pacers.png",
      conference: "east",
    },
    {
      id: "bucks",
      name: "Milwaukee Bucks",
      logo: "/logos/nba/bucks.png",
      conference: "east",
    },
    {
      id: "hawks",
      name: "Atlanta Hawks",
      logo: "/logos/nba/hawks.png",
      conference: "east",
    },
    {
      id: "hornets",
      name: "Charlotte Hornets",
      logo: "/logos/nba/hornets.png",
      conference: "east",
    },
    {
      id: "heat",
      name: "Miami Heat",
      logo: "/logos/nba/heat.gif",
      conference: "east",
    },
    {
      id: "magic",
      name: "Orlando Magic",
      logo: "/logos/nba/magic.png",
      conference: "east",
    },
    {
      id: "wizards",
      name: "Washington Wizards",
      logo: "/logos/nba/wizards.png",
      conference: "east",
    },
    // Western Conference
    {
      id: "nuggets",
      name: "Denver Nuggets",
      logo: "/logos/nba/nuggets.png",
      conference: "west",
    },
    {
      id: "timberwolves",
      name: "Minnesota Timberwolves",
      logo: "/logos/nba/timberwolves.png",
      conference: "west",
    },
    {
      id: "thunder",
      name: "Oklahoma City Thunder",
      logo: "/logos/nba/thunder.png",
      conference: "west",
    },
    {
      id: "blazers",
      name: "Portland Trail Blazers",
      logo: "/logos/nba/blazers.png",
      conference: "west",
    },
    {
      id: "jazz",
      name: "Utah Jazz",
      logo: "/logos/nba/jazz.png",
      conference: "west",
    },
    {
      id: "warriors",
      name: "Golden State Warriors",
      logo: "/logos/nba/warriors.png",
      conference: "west",
    },
    {
      id: "clippers",
      name: "LA Clippers",
      logo: "/logos/nba/clippers.png",
      conference: "west",
    },
    {
      id: "lakers",
      name: "Los Angeles Lakers",
      logo: "/logos/nba/lakers.png",
      conference: "west",
    },
    {
      id: "suns",
      name: "Phoenix Suns",
      logo: "/logos/nba/suns.png",
      conference: "west",
    },
    {
      id: "kings",
      name: "Sacramento Kings",
      logo: "/logos/nba/kings.png",
      conference: "west",
    },
    {
      id: "mavericks",
      name: "Dallas Mavericks",
      logo: "/logos/nba/mavericks.png",
      conference: "west",
    },
    {
      id: "rockets",
      name: "Houston Rockets",
      logo: "/logos/nba/rockets.png",
      conference: "west",
    },
    {
      id: "grizzlies",
      name: "Memphis Grizzlies",
      logo: "/logos/nba/grizzlies.png",
      conference: "west",
    },
    {
      id: "pelicans",
      name: "New Orleans Pelicans",
      logo: "/logos/nba/pelicans.png",
      conference: "west",
    },
    {
      id: "spurs",
      name: "San Antonio Spurs",
      logo: "/logos/nba/spurs.png",
      conference: "west",
    },
  ];

  const filteredTeams1 = teams.filter(
    (team) => team.conference === conference1
  );
  const filteredTeams2 = teams.filter(
    (team) => team.conference === conference2
  );

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
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Select Your NBA Teams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{player1}'s Team</h3>
            <div className="space-y-2">
              <Label>Select Conference</Label>
              <RadioGroup
                value={conference1}
                onValueChange={(value) =>
                  setConference1(value as "east" | "west")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="east" id="east1" />
                  <Label htmlFor="east1">Eastern Conference</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="west" id="west1" />
                  <Label htmlFor="west1">Western Conference</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredTeams1.map((team) => (
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
                  <p className="mt-2 text-center text-sm">{team.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{player2}'s Team</h3>
            <div className="space-y-2">
              <Label>Select Conference</Label>
              <RadioGroup
                value={conference2}
                onValueChange={(value) =>
                  setConference2(value as "east" | "west")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="east" id="east2" />
                  <Label htmlFor="east2">Eastern Conference</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="west" id="west2" />
                  <Label htmlFor="west2">Western Conference</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredTeams2.map((team) => (
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
                  <p className="mt-2 text-center text-sm">{team.name}</p>
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
