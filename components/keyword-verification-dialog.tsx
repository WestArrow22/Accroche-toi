"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"

interface KeywordVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  requiredKeywords: string[]
  onVerify: (keywords: string[]) => void
}

export function KeywordVerificationDialog({
  open,
  onOpenChange,
  title,
  description,
  requiredKeywords,
  onVerify,
}: KeywordVerificationDialogProps) {
  const [keywordInput, setKeywordInput] = useState("")
  const [error, setError] = useState("")

  const handleVerify = () => {
    const keywords = keywordInput
      .toLowerCase()
      .split(/[,\s]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    if (keywords.length < 2) {
      setError("Bitte gib mindestens 2 Stichwörter ein")
      return
    }

    // Überprüfe ob mindestens 2 der erforderlichen Stichwörter enthalten sind
    const matchingKeywords = keywords.filter((keyword) =>
      requiredKeywords.some(
        (required) => keyword.includes(required.toLowerCase()) || required.toLowerCase().includes(keyword),
      ),
    )

    if (matchingKeywords.length >= 1) {
      onVerify(keywords)
      setKeywordInput("")
      setError("")
      onOpenChange(false)
    } else {
      setError(
        `Bitte verwende relevante Stichwörter zu diesem Thema. Beispiele: ${requiredKeywords.slice(0, 3).join(", ")}`,
      )
    }
  }

  const handleCancel = () => {
    setKeywordInput("")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Aktivität:</strong> {description}
            </p>
          </div>

          <div>
            <Label htmlFor="keywords">Beschreibe kurz, was du gelernt/gemacht hast (Stichwörter):</Label>
            <Input
              id="keywords"
              placeholder="z.B. mathematik, gleichungen, gelöst, verstanden, geübt..."
              value={keywordInput}
              onChange={(e) => {
                setKeywordInput(e.target.value)
                setError("")
              }}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Verwende mindestens 2 relevante Stichwörter, getrennt durch Kommas oder Leerzeichen
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs text-yellow-800 mb-2">
              <strong>Hilfreiche Stichwörter für dieses Thema:</strong>
            </p>
            <div className="flex flex-wrap gap-1">
              {requiredKeywords.slice(0, 6).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleVerify}
              disabled={keywordInput.trim().length < 3}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Bestätigen
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Abbrechen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
