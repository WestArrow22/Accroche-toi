"use client"

import { useState } from "react"
import supabase from "@/lib/supabaseClient"

import { HabitLoopForm } from "@/components/habit-loop-form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface HabitLoopProps {
  studentId: string
}

export default function HabitLoop({ studentId }: HabitLoopProps) {
  const [habitType, setHabitType] = useState<"good" | "bad">("good")
  const [values, setValues] = useState({})
  const { toast } = useToast()

  const handleChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveHabitLoop = async () => {
    const { error } = await supabase.from("habit_loops").insert([
      {
        student_id: studentId,
        habit_type: habitType,
        ...values,
      },
    ])

    if (error) {
      toast({
        title: "❌ Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "🎉 Erfolgreich gespeichert",
        description: "Dein Habit Loop wurde gespeichert!",
      })
      setValues({}) // Reset optional
    }
  }

  return (
    <div className="space-y-6">
      {/* Toggle Button für Typ */}
      <div className="flex gap-2">
        <Button
          variant={habitType === "good" ? "default" : "outline"}
          onClick={() => setHabitType("good")}
        >
          Gute Gewohnheit
        </Button>
        <Button
          variant={habitType === "bad" ? "default" : "outline"}
          onClick={() => setHabitType("bad")}
        >
          Schlechte Gewohnheit
        </Button>
      </div>

      {/* Formular */}
      <HabitLoopForm
        habitType={habitType}
        values={values}
        onChange={handleChange}
      />

      {/* Speichern */}
      <Button onClick={handleSaveHabitLoop} className="bg-blue-600 hover:bg-blue-700">
        Gewohnheit speichern
      </Button>
    </div>
  )
}