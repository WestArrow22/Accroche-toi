"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Habit {
  id: string
  name: string
  type: "good" | "bad"
  streak: number
  completedToday: boolean
}

interface PlateauChartProps {
  habits: Habit[]
}

export function PlateauChart({ habits }: PlateauChartProps) {
  const maxStreak = Math.max(...habits.map((h) => h.streak), 20)
  const plateauPoint = Math.max(maxStreak * 0.7, 15)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-lg">Das Plateau des latenten Potentials</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 w-full">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Achsen */}
            <line x1="40" y1="180" x2="380" y2="180" stroke="#374151" strokeWidth="2" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#374151" strokeWidth="2" />

            {/* Beschriftungen */}
            <text x="200" y="195" textAnchor="middle" className="text-xs fill-gray-600">
              Zeit
            </text>
            <text x="25" y="100" textAnchor="middle" className="text-xs fill-gray-600" transform="rotate(-90 25 100)">
              Fortschritt
            </text>

            {/* Plateau Linie */}
            <line x1="40" y1="120" x2="280" y2="120" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
            <text x="285" y="125" className="text-xs fill-red-500">
              Plateau des latenten Potentials
            </text>

            {/* Exponentieller Anstieg */}
            <path d="M 40 180 Q 150 170 280 120 Q 320 80 380 30" fill="none" stroke="#3b82f6" strokeWidth="3" />

            {/* Valley of Disappointment */}
            <text x="120" y="40" className="text-xs fill-gray-500 text-center">
              <tspan x="120" dy="0">
                Valley of
              </tspan>
              <tspan x="120" dy="12">
                Disappointment
              </tspan>
            </text>

            {/* Breakthrough */}
            <text x="320" y="60" className="text-xs fill-green-600 font-semibold">
              Breakthrough!
            </text>

            {/* Habit Punkte */}
            {habits.map((habit, index) => {
              const x = 40 + (habit.streak / maxStreak) * 340
              const y =
                habit.streak < plateauPoint
                  ? 180 - (habit.streak / plateauPoint) * 60
                  : 120 - ((habit.streak - plateauPoint) / (maxStreak - plateauPoint)) * 90

              return (
                <g key={habit.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={habit.type === "good" ? "#10b981" : "#ef4444"}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text x={x} y={y - 12} textAnchor="middle" className="text-xs fill-gray-700 font-medium">
                    {habit.name.length > 10 ? habit.name.substring(0, 10) + "..." : habit.name}
                  </text>
                  <text x={x} y={y + 20} textAnchor="middle" className="text-xs fill-gray-500">
                    {habit.streak}d
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Gute Habits
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            Schlechte Habits
          </Badge>
        </div>

        <p className="text-xs text-gray-600 text-center mt-2">
          Deine Habits auf dem Weg zum Durchbruch! Bleib dran, auch wenn der Fortschritt langsam erscheint.
        </p>
      </CardContent>
    </Card>
  )
}
