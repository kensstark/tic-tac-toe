"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

type GameMode = "normal" | "f1" | "nba";

interface WelcomeScreenProps {
  onStart: (players: string[], mode: GameMode) => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [mode, setMode] = useState<GameMode>("normal");
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);
  const [showPlayerInputs, setShowPlayerInputs] = useState(false);

  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
    if (newMode === "f1") {
      setShowPlayerInputs(true);
    } else {
      setShowPlayerInputs(false);
      setNumPlayers(2);
      setPlayerNames(["", ""]);
    }
  };

  const handleNumPlayersChange = (value: number[]) => {
    const newNum = value[0];
    setNumPlayers(newNum);
    setPlayerNames(Array(newNum).fill(""));
  };

  const handlePlayerNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "f1") {
      if (playerNames.every((name) => name.trim() !== "")) {
        onStart(playerNames, mode);
      }
    } else {
      if (playerNames[0] && playerNames[1]) {
        onStart([playerNames[0], playerNames[1]], mode);
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Welcome to Tic-Tac-Toe!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Game Mode</Label>
            <RadioGroup
              value={mode}
              onValueChange={(value) => handleModeChange(value as GameMode)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">Normal Mode (X and O)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="f1" id="f1" />
                <Label htmlFor="f1">Formula 1 Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nba" id="nba" />
                <Label htmlFor="nba">NBA Mode</Label>
              </div>
            </RadioGroup>
          </div>

          {mode === "f1" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Number of Players (2-10)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[numPlayers]}
                    onValueChange={handleNumPlayersChange}
                    min={2}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{numPlayers}</span>
                </div>
              </div>

              <div className="space-y-4">
                {playerNames.map((name, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`player${index + 1}`}>
                      Player {index + 1} Name
                    </Label>
                    <Input
                      id={`player${index + 1}`}
                      value={name}
                      onChange={(e) =>
                        handlePlayerNameChange(index, e.target.value)
                      }
                      placeholder={`Enter Player ${index + 1} name`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode !== "f1" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="player1">Player 1 Name</Label>
                <Input
                  id="player1"
                  value={playerNames[0]}
                  onChange={(e) => handlePlayerNameChange(0, e.target.value)}
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="player2">Player 2 Name</Label>
                <Input
                  id="player2"
                  value={playerNames[1]}
                  onChange={(e) => handlePlayerNameChange(1, e.target.value)}
                  placeholder="Enter name"
                  required
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full">
            Start Game
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
