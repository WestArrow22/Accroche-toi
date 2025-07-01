"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Coins, Zap, Trophy, Star } from "lucide-react"

interface RewardSystemProps {
  elixir: number
  gold: number
  level: number
  experiencePoints: number
  nextLevelXP: number
}

export function RewardSystem({ elixir, gold, level, experiencePoints, nextLevelXP }: RewardSystemProps) {
  const progressPercentage = (experiencePoints / nextLevelXP) * 100

  const getLevelTitle = (level: number) => {
    if (level < 5) return "Habit Anfänger"
    if (level < 10) return "Gewohnheits-Entdecker"
    if (level < 20) return "Routine-Meister"
    if (level < 30) return "Habit-Experte"
    if (level < 50) return "Transformation-Guru"
    return "Atomic Habits Legende"
  }

  const getLevelColor = (level: number) => {
    if (level < 5) return "bg-gray-500"
    if (level < 10) return "bg-green-500"
    if (level < 20) return "bg-blue-500"
    if (level < 30) return "bg-purple-500"
    if (level < 50) return "bg-orange-500"
    return "bg-gradient-to-r from-yellow-400 to-orange-500"
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Belohnungssystem
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level und Titel */}
        <div className="text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold ${getLevelColor(level)}`}
          >
            <Star className="h-5 w-5" />
            Level {level} - {getLevelTitle(level)}
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Erfahrungspunkte</span>
            <span>
              {experiencePoints} / {nextLevelXP} XP
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Währungen */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center gap-2 p-3 bg-blue-100 rounded-lg">
            <Zap className="h-6 w-6 text-blue-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">{elixir}</div>
              <div className="text-sm text-blue-600">Elixir</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 p-3 bg-yellow-100 rounded-lg">
            <Coins className="h-6 w-6 text-yellow-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-700">{gold}</div>
              <div className="text-sm text-yellow-600">Gold</div>
            </div>
          </div>
        </div>

        {/* Belohnungs-Info */}
        <div className="bg-white/50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Wie verdiene ich Belohnungen?</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>• Habit abschließen</span>
              <span className="text-blue-600">+5 Elixir, +10 Gold, +20 XP</span>
            </div>
            <div className="flex justify-between">
              <span>• Lernmethode nutzen</span>
              <span className="text-blue-600">+3 Elixir, +5 Gold, +15 XP</span>
            </div>
            <div className="flex justify-between">
              <span>• Neues Habit erstellen</span>
              <span className="text-blue-600">+10 Elixir, +20 Gold, +50 XP</span>
            </div>
            <div className="flex justify-between">
              <span>• 7-Tage Streak</span>
              <span className="text-blue-600">+25 Elixir, +50 Gold, +100 XP</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
