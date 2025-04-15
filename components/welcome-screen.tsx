"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomeScreenProps {
  onStart: (player1: string, player2: string, mode: "normal" | "f1") => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [mode, setMode] = useState<"normal" | "f1">("normal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1 && player2) {
      onStart(player1, player2, mode);
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player1">Player 1 Name</Label>
              <Input
                id="player1"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="player2">Player 2 Name</Label>
              <Input
                id="player2"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Game Mode</Label>
            <RadioGroup
              value={mode}
              onValueChange={(value) => setMode(value as "normal" | "f1")}
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
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full">
            Start Game
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
