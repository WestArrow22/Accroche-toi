"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Medal, Award, Zap, Coins, Target, Crown, Star } from "lucide-react"

interface Student {
  id: string
  name: string
  rewards: {
    elixir: number
    gold: number
    level: number
  }
  weeklyStats: {
    completedHabits: number
    completedTasks: number
    learningMethodsUsed: number
    totalPoints: number
  }
}

interface LeaderboardProps {
  students: Student[]
  currentWeek: string
}

export function Leaderboard({ students, currentWeek }: LeaderboardProps) {
  // Sortiere Schüler nach Gesamtpunkten (Kombination aus verschiedenen Aktivitäten)
  const sortedStudents = [...students].sort((a, b) => {
    const aTotal = a.weeklyStats.totalPoints
    const bTotal = b.weeklyStats.totalPoints
    return bTotal - aTotal
  })

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />
      default:
        return <Star className="h-5 w-5 text-gray-400" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300"
      case 2:
        return "bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300"
      case 3:
        return "bg-gradient-to-r from-orange-100 to-red-100 border-orange-300"
      default:
        return "bg-white border-gray-200"
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-500 text-white">🥇 Champion</Badge>
      case 2:
        return <Badge className="bg-gray-500 text-white">🥈 Vize-Champion</Badge>
      case 3:
        return <Badge className="bg-orange-500 text-white">🥉 Bronze</Badge>
      default:
        return <Badge variant="outline">#{rank}</Badge>
    }
  }

  const maxPoints = Math.max(...sortedStudents.map((s) => s.weeklyStats.totalPoints), 1)

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-purple-600" />
              Wöchentliches Leaderboard
            </div>
            <Badge variant="outline" className="bg-white">
              Woche: {currentWeek}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedStudents.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Noch keine Aktivitäten diese Woche</p>
                <p className="text-gray-400 text-sm">
                  Das Leaderboard wird aktualisiert, sobald Schüler Aufgaben erledigen
                </p>
              </div>
            ) : (
              sortedStudents.map((student, index) => {
                const rank = index + 1
                const progressPercentage = (student.weeklyStats.totalPoints / maxPoints) * 100

                return (
                  <div
                    key={student.id}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getRankColor(rank)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getRankIcon(rank)}
                        <div>
                          <h3 className="font-bold text-lg">{student.name}</h3>
                          {getRankBadge(rank)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{student.weeklyStats.totalPoints}</div>
                        <div className="text-sm text-gray-600">Punkte</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-2 bg-white/50 rounded">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Target className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Habits</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">{student.weeklyStats.completedHabits}</div>
                      </div>

                      <div className="text-center p-2 bg-white/50 rounded">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Trophy className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">Tasks</span>
                        </div>
                        <div className="text-lg font-bold text-orange-600">{student.weeklyStats.completedTasks}</div>
                      </div>

                      <div className="text-center p-2 bg-white/50 rounded">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Zap className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Elixir</span>
                        </div>
                        <div className="text-lg font-bold text-blue-600">{student.rewards.elixir}</div>
                      </div>

                      <div className="text-center p-2 bg-white/50 rounded">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Coins className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">Gold</span>
                        </div>
                        <div className="text-lg font-bold text-yellow-600">{student.rewards.gold}</div>
                      </div>
                    </div>

                    {rank === 1 && student.weeklyStats.totalPoints > 0 && (
                      <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-center">
                        <p className="text-sm font-medium text-yellow-800">
                          🎉 Wochensieger! Fantastische Leistung! 🎉
                        </p>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Punktesystem:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
              <div>• Habit abgeschlossen: 20 Punkte</div>
              <div>• Daily Task erledigt: 15 Punkte</div>
              <div>• Lernmethode verwendet: 10 Punkte</div>
              <div>• 7-Tage Streak: 50 Bonus-Punkte</div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Das Leaderboard wird jeden Sonntag um Mitternacht zurückgesetzt. Viel Erfolg! 🚀
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
