"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GroupLearningDialog } from "@/components/group-learning-dialog"
import { BookOpen, Users, Lock, Star } from "lucide-react"

interface LearningMethodTrackerProps {
  currentStudentId: string
  allStudents: Array<{ id: string; name: string }>
  onUseMethod: (method: string, description: string) => void
  onGroupLearning: (participantIds: string[], description: string, method: string) => void
  studentLevel?: number
}

const learningMethods = [
  "Active Retrieval",
  "Flashcards",
  "Feynman-Methode",
  "Blurting/Brain Dumping",
  "Reasoning",
  "Mnemotechniken",
  "SQ3R Methode",
  "Teaching",
  "Chunking",
]

const getLearningMethodRequiredLevel = (method: string): number => {
  const levelRequirements = {
    "Active Retrieval": 1,
    Flashcards: 1,
    "Feynman-Methode": 2,
    "Blurting/Brain Dumping": 2,
    Reasoning: 3,
    Mnemotechniken: 3,
    "SQ3R Methode": 4,
    Teaching: 4,
    Chunking: 5,
  }
  return levelRequirements[method as keyof typeof levelRequirements] || 1
}

const isLearningMethodUnlocked = (method: string, studentLevel: number): boolean => {
  return studentLevel >= getLearningMethodRequiredLevel(method)
}

const getLearningMethodDescription = (method: string): string => {
  const descriptions = {
    "Active Retrieval": "Versuche Informationen aus dem Gedächtnis abzurufen, ohne Hilfsmittel zu verwenden.",
    Flashcards: "Erstelle Karten mit Fragen auf der einen und Antworten auf der anderen Seite.",
    "Feynman-Methode": "Erkläre ein komplexes Thema in einfachen Worten, als würdest du es einem Kind erklären.",
    "Blurting/Brain Dumping": "Schreibe alles auf, was du über ein Thema weißt, ohne nachzudenken.",
    Reasoning: "Verstehe die Logik und Zusammenhänge hinter den Informationen.",
    Mnemotechniken: "Verwende Gedächtnistricks und Eselsbrücken zum besseren Merken.",
    "SQ3R Methode": "Survey, Question, Read, Recite, Review - eine strukturierte Lesemethode.",
    Teaching: "Erkläre anderen das Gelernte oder unterrichte es.",
    Chunking: "Teile große Informationsmengen in kleinere, handhabbare Teile auf.",
  }
  return descriptions[method as keyof typeof descriptions] || ""
}

export function LearningMethodTracker({
  currentStudentId,
  allStudents,
  onUseMethod,
  onGroupLearning,
  studentLevel = 1,
}: LearningMethodTrackerProps) {
  const [selectedMethod, setSelectedMethod] = useState("")
  const [description, setDescription] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [showGroupDialog, setShowGroupDialog] = useState(false)

  const handleUseMethod = () => {
    if (selectedMethod && description.trim()) {
      onUseMethod(selectedMethod, description)
      setDescription("")
      setSelectedMethod("")
      setShowDialog(false)
    }
  }

  const unlockedMethods = learningMethods.filter((method) => isLearningMethodUnlocked(method, studentLevel))
  const lockedMethods = learningMethods.filter((method) => !isLearningMethodUnlocked(method, studentLevel))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Lernmethoden anwenden
            <Badge variant="outline" className="ml-auto">
              <Star className="h-3 w-3 mr-1" />
              Level {studentLevel}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Freigeschaltete Methoden */}
            {unlockedMethods.map((method) => (
              <div key={method} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{method}</h3>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    Level {getLearningMethodRequiredLevel(method)}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{getLearningMethodDescription(method)}</p>
                <Dialog open={showDialog && selectedMethod === method} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => setSelectedMethod(method)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Anwenden
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{method} anwenden</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Methode:</strong> {getLearningMethodDescription(method)}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="description">Beschreibe, wie du diese Lernmethode angewendet hast:</Label>
                        <Textarea
                          id="description"
                          placeholder="z.B. Ich habe die Feynman-Methode verwendet, um Photosynthese zu erklären..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleUseMethod}
                          disabled={!description.trim()}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Lernmethode bestätigen (+5 Elixir, +2 Gold, +15 XP)
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowDialog(false)
                            setDescription("")
                            setSelectedMethod("")
                          }}
                        >
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}

            {/* Gesperrte Methoden */}
            {lockedMethods.map((method) => (
              <div key={method} className="p-4 border rounded-lg bg-gray-50 opacity-60">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm text-gray-500">{method}</h3>
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3 text-gray-400" />
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                      Level {getLearningMethodRequiredLevel(method)}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{getLearningMethodDescription(method)}</p>
                <Button size="sm" disabled className="w-full">
                  <Lock className="h-3 w-3 mr-1" />
                  Gesperrt
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Gruppenlernaktivität</h3>
                <p className="text-sm text-gray-600">Lerne gemeinsam mit anderen Schülern</p>
              </div>
              <GroupLearningDialog
                currentStudentId={currentStudentId}
                allStudents={allStudents}
                availableMethods={unlockedMethods}
                onGroupLearning={onGroupLearning}
              >
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Gruppenlernaktivität starten
                </Button>
              </GroupLearningDialog>
            </div>
          </div>

          {lockedMethods.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>💡 Tipp:</strong> Erreiche Level {getLearningMethodRequiredLevel(lockedMethods[0])}, um "
                {lockedMethods[0]}" freizuschalten! Sammle mehr XP durch das Abschließen von Gewohnheiten und Daily
                Tasks.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
