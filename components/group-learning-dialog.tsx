"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, CheckCircle } from "lucide-react"

interface GroupLearningDialogProps {
  currentStudentId: string
  allStudents: Array<{ id: string; name: string }>
  availableMethods: string[]
  onGroupLearning: (participantIds: string[], description: string, method: string) => void
  children: React.ReactNode
}

export function GroupLearningDialog({
  currentStudentId,
  allStudents,
  availableMethods,
  onGroupLearning,
  children,
}: GroupLearningDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState("")
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([currentStudentId])
  const [description, setDescription] = useState("")
  const [showDialog, setShowDialog] = useState(false)

  const handleParticipantToggle = (studentId: string) => {
    if (studentId === currentStudentId) return // Kann sich selbst nicht abwählen

    setSelectedParticipants((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleStartGroupLearning = () => {
    if (selectedMethod && description.trim().length >= 15 && selectedParticipants.length >= 2) {
      onGroupLearning(selectedParticipants, description, selectedMethod)
      setSelectedMethod("")
      setDescription("")
      setSelectedParticipants([currentStudentId])
      setShowDialog(false)
    }
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Gruppenlernaktivität
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Lernmethode wählen</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {availableMethods.slice(0, 4).map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedMethod === method}
                    onCheckedChange={() => setSelectedMethod(selectedMethod === method ? "" : method)}
                  />
                  <span className="text-sm">{method}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Teilnehmer ({selectedParticipants.length})</Label>
            <div className="max-h-32 overflow-y-auto mt-2 space-y-1">
              {allStudents.slice(0, 8).map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedParticipants.includes(student.id)}
                    onCheckedChange={() => handleParticipantToggle(student.id)}
                    disabled={student.id === currentStudentId}
                  />
                  <span className={`text-sm ${student.id === currentStudentId ? "font-medium" : ""}`}>
                    {student.name} {student.id === currentStudentId && "(Du)"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Beschreibung</Label>
            <Textarea
              placeholder="Was habt ihr zusammen gelernt?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleStartGroupLearning}
              disabled={!selectedMethod || description.trim().length < 15 || selectedParticipants.length < 2}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Starten
            </Button>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Abbrechen
            </Button>
          </div>

          <div className="text-xs text-gray-500">Mindestens 2 Teilnehmer und 15 Zeichen Beschreibung erforderlich</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
