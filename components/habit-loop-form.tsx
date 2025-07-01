"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Heart, Zap, CheckCircle, EyeOff, Frown, AlertTriangle, X, Target, Brain, Play, Gift } from "lucide-react"

interface HabitLoopFormProps {
  habitType: "good" | "bad"
  values: {
    // 4 Laws
    obvious?: string
    attractive?: string
    easy?: string
    satisfying?: string
    invisible?: string
    unattractive?: string
    difficult?: string
    unsatisfying?: string
    // Habit Loop
    cue?: string
    craving?: string
    response?: string
    reward?: string
  }
  onChange: (field: string, value: string) => void
}

export function HabitLoopForm({ habitType, values, onChange }: HabitLoopFormProps) {
  return (
    <div className="space-y-6">
      {/* Habit Loop */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Brain className="h-5 w-5" />
            Der Habit Loop (Gewohnheitsschleife)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-2 text-indigo-600">
              <Target className="h-4 w-4" />
              1. Cue (Auslöser)
            </Label>
            <Textarea
              placeholder="Was löst diese Gewohnheit aus? (Zeit, Ort, Gefühl, Person, vorherige Handlung)"
              value={values.cue || ""}
              onChange={(e) => onChange("cue", e.target.value)}
              className="border-indigo-200 focus:border-indigo-400"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 text-purple-600">
              <Brain className="h-4 w-4" />
              2. Craving (Verlangen)
            </Label>
            <Textarea
              placeholder="Welches Verlangen/Bedürfnis wird dadurch ausgelöst? Was motiviert dich?"
              value={values.craving || ""}
              onChange={(e) => onChange("craving", e.target.value)}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 text-green-600">
              <Play className="h-4 w-4" />
              3. Response (Reaktion)
            </Label>
            <Textarea
              placeholder="Was ist die konkrete Handlung/Gewohnheit, die du ausführst?"
              value={values.response || ""}
              onChange={(e) => onChange("response", e.target.value)}
              className="border-green-200 focus:border-green-400"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 text-orange-600">
              <Gift className="h-4 w-4" />
              4. Reward (Belohnung)
            </Label>
            <Textarea
              placeholder="Welche Belohnung/Befriedigung erhältst du? Was macht es befriedigend?"
              value={values.reward || ""}
              onChange={(e) => onChange("reward", e.target.value)}
              className="border-orange-200 focus:border-orange-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4 Laws of Behavior Change */}
      <Card>
        <CardHeader>
          <CardTitle>Die 4 Gesetze der Verhaltensänderung</CardTitle>
        </CardHeader>
        <CardContent>
          {habitType === "good" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  1. Make it Obvious (Offensichtlich)
                </Label>
                <Textarea
                  placeholder="Wie machst du das Habit sichtbar und offensichtlich?"
                  value={values.obvious || ""}
                  onChange={(e) => onChange("obvious", e.target.value)}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  2. Make it Attractive (Attraktiv)
                </Label>
                <Textarea
                  placeholder="Wie machst du das Habit verlockend und attraktiv?"
                  value={values.attractive || ""}
                  onChange={(e) => onChange("attractive", e.target.value)}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  3. Make it Easy (Einfach)
                </Label>
                <Textarea
                  placeholder="Wie machst du das Habit einfach und reibungslos?"
                  value={values.easy || ""}
                  onChange={(e) => onChange("easy", e.target.value)}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  4. Make it Satisfying (Befriedigend)
                </Label>
                <Textarea
                  placeholder="Wie machst du das Habit befriedigend und belohnend?"
                  value={values.satisfying || ""}
                  onChange={(e) => onChange("satisfying", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4" />
                  1. Make it Invisible (Unsichtbar)
                </Label>
                <Textarea
                  placeholder="Wie machst du das schlechte Habit unsichtbar?"
                  value={values.invisible || ""}
                  onChange={(e) => onChange("invisible", e.target.value)}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Frown className="h-4 w-4" />
                  2. Make it Unattractive (Unattraktiv)
                </Label>
                <Textarea
                  placeholder="Wie machst du das schlechte Habit unattraktiv?"
                  value={values.unattractive || ""}
                  onChange={(e) => onChange("unattractive", e.target.value)}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  3. Make it Difficult (Schwierig)
                </Label>
                <Textarea
                  placeholder="Wie machst du das schlechte Habit schwierig?"
                  value={values.difficult || ""}
                  onChange={(e) => onChange("difficult", e.target.value)}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  4. Make it Unsatisfying (Unbefriedigend)
                </Label>
                <Textarea
                  placeholder="Wie machst du das schlechte Habit unbefriedigend?"
                  value={values.unsatisfying || ""}
                  onChange={(e) => onChange("unsatisfying", e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
