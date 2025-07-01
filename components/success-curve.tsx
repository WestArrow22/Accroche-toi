"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface Activity {
  date: string
  type: "habit" | "task" | "learning"
  points: number
  name: string
}

interface SuccessCurveProps {
  activities: Activity[]
  studentName?: string
}

export function SuccessCurve({ activities, studentName }: SuccessCurveProps) {
  // Gruppiere Aktivitäten nach Datum und berechne tägliche Punkte
  const dailyPoints = activities.reduce(
    (acc, activity) => {
      const date = activity.date.split("T")[0] // Nur Datum, ohne Zeit
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += activity.points
      return acc
    },
    {} as Record<string, number>,
  )

  // Erstelle Datenpunkte für die letzten 14 Tage
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    return date.toISOString().split("T")[0]
  })

  const chartData = last14Days.map((date) => ({
    date,
    points: dailyPoints[date] || 0,
    dayName: new Date(date + "T00:00:00").toLocaleDateString("de-DE", { weekday: "short" }),
  }))

  const maxPoints = Math.max(...chartData.map((d) => d.points), 100)
  const totalPoints = chartData.reduce((sum, d) => sum + d.points, 0)
  const avgPoints = Math.round(totalPoints / 14)

  // Berechne Trend (letzte 7 Tage vs. vorherige 7 Tage)
  const recentPoints = chartData.slice(7).reduce((sum, d) => sum + d.points, 0)
  const previousPoints = chartData.slice(0, 7).reduce((sum, d) => sum + d.points, 0)
  const trend = recentPoints > previousPoints ? "up" : recentPoints < previousPoints ? "down" : "stable"

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          {studentName ? `${studentName}'s Erfolgskurve` : "Meine Erfolgskurve"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Statistiken */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
              <div className="text-xs text-blue-700">Gesamt Punkte (14 Tage)</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{avgPoints}</div>
              <div className="text-xs text-green-700">Ø Punkte/Tag</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp
                  className={`h-4 w-4 ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}`}
                />
                <span
                  className={`text-sm font-medium ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}`}
                >
                  {trend === "up" ? "Steigend" : trend === "down" ? "Fallend" : "Stabil"}
                </span>
              </div>
              <div className="text-xs text-purple-700">Trend</div>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-48 w-full">
            <svg viewBox="0 0 400 160" className="w-full h-full">
              {/* Gitter */}
              <defs>
                <pattern id="grid" width="28.57" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 28.57 0 L 0 0 0 32" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="160" fill="url(#grid)" />

              {/* Achsen */}
              <line x1="40" y1="140" x2="380" y2="140" stroke="#374151" strokeWidth="2" />
              <line x1="40" y1="20" x2="40" y2="140" stroke="#374151" strokeWidth="2" />

              {/* Erfolgskurve */}
              <path
                d={`M 40 ${140 - (chartData[0].points / maxPoints) * 120} ${chartData
                  .map((d, i) => `L ${40 + i * 24.3} ${140 - (d.points / maxPoints) * 120}`)
                  .join(" ")}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Datenpunkte */}
              {chartData.map((d, i) => {
                const x = 40 + i * 24.3
                const y = 140 - (d.points / maxPoints) * 120
                return (
                  <g key={d.date}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill={d.points > 0 ? "#3b82f6" : "#e5e7eb"}
                      stroke="white"
                      strokeWidth="2"
                    />
                    {d.points > 0 && (
                      <text x={x} y={y - 10} textAnchor="middle" className="text-xs fill-blue-600 font-medium">
                        {d.points}
                      </text>
                    )}
                    <text x={x} y={155} textAnchor="middle" className="text-xs fill-gray-600">
                      {d.dayName}
                    </text>
                  </g>
                )
              })}

              {/* Durchschnittslinie */}
              <line
                x1="40"
                y1={140 - (avgPoints / maxPoints) * 120}
                x2="380"
                y2={140 - (avgPoints / maxPoints) * 120}
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text x="385" y={145 - (avgPoints / maxPoints) * 120} className="text-xs fill-orange-600">
                Ø {avgPoints}
              </text>
            </svg>
          </div>

          {/* Legende */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Erfolgskurve
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-orange-500 border-dashed rounded-full"></div>
              Durchschnitt
            </Badge>
          </div>

          {/* Motivationstext */}
          <div className="text-center">
            {trend === "up" && (
              <p className="text-sm text-green-600 font-medium">
                🚀 Fantastisch! Deine Aktivität steigt kontinuierlich!
              </p>
            )}
            {trend === "down" && (
              <p className="text-sm text-orange-600 font-medium">
                💪 Bleib dran! Kleine Schritte führen zu großen Erfolgen!
              </p>
            )}
            {trend === "stable" && (
              <p className="text-sm text-blue-600 font-medium">⚖️ Konstante Leistung! Versuche dich zu steigern!</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
