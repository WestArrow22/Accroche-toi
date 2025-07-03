"use client"
import supabase from '@/lib/supabaseClient'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, Clock, BookOpen, Brain, Zap, Coins, Check } from "lucide-react"

interface DailyTask {
  id: string
  title: string
  description: string
  type: "vocabulary" | "learning_method" | "study_general"
  completed: boolean
  completionKeywords: string[]
  completedAt?: string
}

interface DailyTasksProps {
  studentId: string
  tasks: DailyTask[]
  onCompleteTask: (taskId: string, keywords: string[]) => void
  onResetTasks: () => void
}

const generateDailyTasks = (studentId: string, date: string = new Date().toDateString()): DailyTask[] => {
  // Verwende studentId und Datum für konsistente aber verschiedene Tasks pro Schüler
  const seed = studentId + date
  const random = (index: number) => {
    let hash = 0
    const str = seed + index
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return (Math.abs(hash) % 1000) / 1000
  }

  const vocabularyTasks = [
    {
      title: "Englisch Vokabeln lernen",
      description: "Lerne 20 neue englische Vokabeln für 20 Minuten",
    },
    {
      title: "Französisch Vokabeln üben",
      description: "Wiederhole französische Vokabeln für 20 Minuten",
    },
    {
      title: "Deutsch Wortschatz erweitern",
      description: "Lerne neue deutsche Wörter und deren Bedeutung",
    },
    {
      title: "Englisch Phrasen üben",
      description: "Übe englische Redewendungen und Phrasen",
    },
    {
      title: "Französisch Grammatik",
      description: "Lerne französische Grammatikregeln für 15 Minuten",
    },
  ]

  const learningMethodTasks = [
    {
      title: "Active Retrieval anwenden",
      description: "Verwende Active Retrieval für ein Schulfach (30 Min)",
    },
    {
      title: "Feynman-Methode nutzen",
      description: "Erkläre ein komplexes Thema in einfachen Worten",
    },
    {
      title: "Flashcards erstellen",
      description: "Erstelle 15 neue Flashcards für ein Fach",
    },
    {
      title: "Mind Map erstellen",
      description: "Erstelle eine Mind Map zu einem Lernthema",
    },
    {
      title: "Zusammenfassung schreiben",
      description: "Schreibe eine Zusammenfassung eines Kapitels",
    },
  ]

  const generalStudyTasks = [
    {
      title: "Mathe Aufgaben lösen",
      description: "Löse 10 Mathematik-Aufgaben konzentriert",
    },
    {
      title: "NT (Naturwissenschaften) studieren",
      description: "Lerne 30 Minuten Biologie, Chemie oder Physik",
    },
    {
      title: "RZG wiederholen",
      description: "Wiederhole Geografie oder Geschichte für 25 Minuten",
    },
    {
      title: "Deutsch Grammatik üben",
      description: "Übe deutsche Grammatikregeln für 25 Minuten",
    },
    {
      title: "Sport Theorie lernen",
      description: "Lerne Sportregeln oder Bewegungsabläufe",
    },
    {
      title: "Französisch Übungen",
      description: "Bearbeite französische Übungen für 20 Minuten",
    },
    {
      title: "Englisch Texte lesen",
      description: "Lese englische Texte und beantworte Fragen",
    },
  ]

  // Wähle basierend auf dem Seed verschiedene Aufgaben für jeden Schüler
  const selectedTasks = [
    {
      ...vocabularyTasks[Math.floor(random(0) * vocabularyTasks.length)],
      type: "vocabulary" as const,
    },
    {
      ...learningMethodTasks[Math.floor(random(1) * learningMethodTasks.length)],
      type: "learning_method" as const,
    },
    {
      ...generalStudyTasks[Math.floor(random(2) * generalStudyTasks.length)],
      type: "study_general" as const,
    },
  ]

  return selectedTasks.map((task, index) => ({
    id: `daily-${date}-${studentId}-${index}`,
    title: task.title,
    description: task.description,
    type: task.type,
    completed: false,
    completionKeywords: [],
  }))
}

export function DailyTasks({ studentId, tasks, onCompleteTask, onResetTasks }: DailyTasksProps) {
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null)
  const [keywordInput, setKeywordInput] = useState("")
  const [showDialog, setShowDialog] = useState(false)

  const [dbTasks, setDbTasks] = useState<DailyTask[]>([])

  useEffect(() => {
    const loadTasks = async () => {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('student_id', studentId)

      if (error) {
        console.error('❌ Fehler beim Laden der Tasks aus Supabase:', error.message)
      } else {
        setDbTasks(data as DailyTask[])
      }
    }

    loadTasks()
  }, [studentId])

  // Prüfe ob neue Tasks für heute generiert werden müssen
  const today = new Date().toDateString()
  const needsNewTasks = tasks.length === 0 || (tasks.length > 0 && !tasks[0].id.includes(today))

  if (needsNewTasks) {
    // Generiere neue Tasks für heute
    const newTasks = generateDailyTasks(studentId, today)
    // Hier würde normalerweise onResetTasks aufgerufen, aber das machen wir im Parent
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "vocabulary":
        return <BookOpen className="h-5 w-5" />
      case "learning_method":
        return <Brain className="h-5 w-5" />
      case "study_general":
        return <Clock className="h-5 w-5" />
      default:
        return <CheckCircle className="h-5 w-5" />
    }
  }

  const getTaskColor = (type: string) => {
    switch (type) {
      case "vocabulary":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "learning_method":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "study_general":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleCompleteTask = () => {
    if (!selectedTask) return

    const keywords = keywordInput
      .toLowerCase()
      .split(/[,\s]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    // Einfache Validierung: mindestens 10 Zeichen Text
    if (keywordInput.trim().length >= 10) {
      onCompleteTask(selectedTask.id, keywords)
      setShowDialog(false)
      setKeywordInput("")
      setSelectedTask(null)
    } else {
      alert("Bitte beschreibe kurz (mindestens 10 Zeichen), was du gemacht hast.")
    }
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-orange-600" />
              Tägliche Lernaufgaben
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white">
                {completedTasks}/{totalTasks} erledigt
              </Badge>
              {completedTasks === totalTasks && <Badge className="bg-green-600">🎉 Alle geschafft!</Badge>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  task.completed
                    ? "bg-green-50 border-green-200 opacity-75"
                    : "bg-white border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getTaskColor(task.type)}`}>
                      {task.completed ? <Check className="h-5 w-5" /> : getTaskIcon(task.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>

                      {task.completed && task.completionKeywords.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Verwendete Stichwörter:</p>
                          <div className="flex flex-wrap gap-1">
                            {task.completionKeywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.completed ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Erledigt
                        </Badge>
                        <div className="text-xs text-green-600">
                          +8 <Zap className="h-3 w-3 inline" /> +5 <Coins className="h-3 w-3 inline" /> +25 XP
                        </div>
                      </div>
                    ) : (
                      <Dialog open={showDialog && selectedTask?.id === task.id} onOpenChange={setShowDialog}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => setSelectedTask(task)}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Erledigt
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Aufgabe abschließen: {task.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Aufgabe:</strong> {task.description}
                              </p>
                            </div>

                            <div>
                              <Label htmlFor="keywords">Beschreibe kurz, was du gelernt/gemacht hast:</Label>
                              <Input
                                id="keywords"
                                placeholder="z.B. Ich habe englische Vokabeln zum Thema Tiere gelernt..."
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                className="mt-1"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Beschreibe einfach kurz, was du gemacht hast (mindestens 10 Zeichen)
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={handleCompleteTask}
                                disabled={keywordInput.trim().length < 10}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Aufgabe abschließen (+8 Elixir, +5 Gold, +25 XP)
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowDialog(false)
                                  setKeywordInput("")
                                  setSelectedTask(null)
                                }}
                              >
                                Abbrechen
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {completedTasks === totalTasks && (
            <div className="mt-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-center">
              <h3 className="font-bold text-green-800 mb-2">🎉 Fantastisch! Alle täglichen Aufgaben erledigt!</h3>
              <p className="text-sm text-green-700">
                Du hast heute großartige Lernfortschritte gemacht. Bonus: +20 Elixir, +10 Gold, +75 XP!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export { generateDailyTasks }
export type { DailyTask }
