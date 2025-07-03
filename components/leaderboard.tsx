"use client"

import { useState, useEffect } from "react"
import supabase from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Medal, Award, Zap, Coins, Target, Crown, Star } from "lucide-react"

interface StatBoxProps {
  label: string
  value: number
  icon: React.ReactNode
}

const StatBox = ({ label, value, icon }: StatBoxProps) => (
  <div className="p-2 bg-white/50 rounded text-center">
    <div className="flex items-center justify-center gap-1 mb-1">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="text-lg font-bold">{value}</div>
  </div>
)

const getCurrentWeekLabel = () => {
  const now = new Date()
  const week = Math.ceil((((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000) + new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7)
  return `${now.getFullYear()}-KW${String(week).padStart(2, "0")}`
}

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

export function Leaderboard() {
  const [students, setStudents] = useState<Student[]>([])
  const currentWeek = getCurrentWeekLabel()

  const loadData = async () => {
    const { data, error } = await supabase
      .from("weekly_stats")
      .select(`
        completed_habits,
        completed_tasks,
        learning_methods,
        total_points,
        students (
          id,
          name,
          elixir,
          gold,
          level
        )
      `)
      .eq("week_label", currentWeek)

    if (error) {
      console.error("❌ Fehler beim Laden:", error.message)
      return
    }

    const mapped = (data ?? [])
      .filter((entry) => entry.students)
      .map((entry: any) => ({
        id: entry.students.id,
        name: entry.students.name,
        rewards: {
          elixir: entry.students.elixir,
          gold: entry.students.gold,
          level: entry.students.level,
        },
        weeklyStats: {
          completedHabits: entry.completed_habits,
          completedTasks: entry.completed_tasks,
          learningMethodsUsed: entry.learning_methods,
          totalPoints: entry.total_points,
        },
      }))

    setStudents(mapped)
  }

  useEffect(() => {
    loadData()
  }, [currentWeek])

  useEffect(() => {
    const channel = supabase
      .channel("realtime-leaderboard")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "weekly_stats" },
        () => {
          loadData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sortedStudents = [...students].sort((a, b) => b.weeklyStats.totalPoints - a.weeklyStats.totalPoints)
  const maxPoints = Math.max(...sortedStudents.map((s) => s.weeklyStats.totalPoints), 1)

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
  
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-purple-600" />
              Wöchentliches Leaderboard
            </div>
            <Badge variant="outline" className="bg-white">Woche: {currentWeek}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                Noch keine Aktivitäten diese Woche
              </div>
            ) : (
              sortedStudents.map((student, index) => {
                const rank = index + 1
                const progressPercentage = (student.weeklyStats.totalPoints / maxPoints) * 100

                return (
                  <div key={student.id} className={`p-4 rounded-lg border-2 ${getRankColor(rank)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getRankIcon(rank)}
                        <div>
                          <h3 className="font-bold text-lg">{student.name}</h3>
                          {getRankBadge(rank)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {student.weeklyStats.totalPoints}
                        </div>
                        <div className="text-sm text-gray-600">Punkte</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                      <StatBox label="Habits" value={student.weeklyStats.completedHabits} icon={<Target className="text-green-600 h-4 w-4 mx-auto" />} />
                      <StatBox label="Tasks" value={student.weeklyStats.completedTasks} icon={<Trophy className="text-orange-600 h-4 w-4 mx-auto" />} />
                      <StatBox label="Elixir" value={student.rewards.elixir} icon={<Zap className="text-blue-600 h-4 w-4 mx-auto" />} />
                      <StatBox label="Gold" value={student.rewards.gold} icon={<Coins className="text-yellow-600 h-4 w-4 mx-auto" />} />
                    </div>

                    {rank === 1 && student.weeklyStats.totalPoints > 0 && (
                      <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-center">
                        🎉 Wochensieger! Fantastische Leistung! 🎉
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Punktesystem:</h4>
            <ul className="space-y-1">
              <li>• Habit abgeschlossen: 20 Punkte</li>
              <li>• Daily Task erledigt: 15 Punkte</li>
              <li>• Lernmethode verwendet: 10 Punkte</li>
              <li>• 7-Tage Streak: 50 Bonus-Punkte</li>
            </ul>
            <p className="text-xs mt-2 text-blue-600">
              Das Leaderboard wird jeden Sonntag um Mitternacht zurückgesetzt. Viel Erfolg! 🚀
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

//