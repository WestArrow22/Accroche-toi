"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Lightbulb, MessageSquare, Search, Repeat, FileText } from "lucide-react"

interface LearningMethod {
  name: string
  icon: React.ReactNode
  description: string
  howItWorks: string
  example: string
  tips: string[]
}

interface LearningMethodsInfoProps {
  onUseMethod?: (method: string) => void
}

const learningMethodsData: LearningMethod[] = [
  {
    name: "Active Retrieval",
    icon: <Brain className="h-5 w-5" />,
    description: "Das aktive Abrufen von Informationen aus dem Gedächtnis ohne Hilfsmittel.",
    howItWorks:
      "Versuche Informationen aus dem Kopf zu reproduzieren, ohne in Notizen oder Bücher zu schauen. Das stärkt die Gedächtnisverbindungen.",
    example:
      "Nach dem Lesen eines Kapitels über Photosynthese schließt du das Buch und versuchst, alle wichtigen Schritte der Photosynthese aufzuschreiben.",
    tips: [
      "Stelle dir selbst Fragen zum Stoff",
      "Erkläre Konzepte laut vor dich hin",
      "Verwende keine Hilfsmittel beim ersten Versuch",
      "Überprüfe erst danach deine Antworten",
    ],
  },
  {
    name: "Flashcards",
    icon: <Repeat className="h-5 w-5" />,
    description: "Kleine Karten mit Fragen auf der Vorderseite und Antworten auf der Rückseite.",
    howItWorks:
      "Wiederhole regelmäßig die Karten, schwierige Karten öfter als einfache. Nutze das Spaced Repetition System.",
    example:
      "Vorderseite: 'Was ist die Hauptstadt von Frankreich?' - Rückseite: 'Paris'. Wiederhole täglich und sortiere schwierige Karten aus.",
    tips: [
      "Halte Karten kurz und präzise",
      "Verwende Bilder wenn möglich",
      "Wiederhole schwierige Karten öfter",
      "Nutze digitale Apps wie Anki oder Quizlet",
    ],
  },
  {
    name: "Feynman-Methode",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Erkläre komplexe Konzepte in einfachen Worten, als würdest du es einem Kind erklären.",
    howItWorks:
      "1. Wähle ein Thema 2. Erkläre es einfach 3. Identifiziere Lücken 4. Gehe zurück zum Material 5. Vereinfache weiter",
    example:
      "Erkläre Photosynthese: 'Pflanzen sind wie kleine Fabriken. Sie nehmen Sonnenlicht, Wasser und CO2 und machen daraus Zucker und Sauerstoff.'",
    tips: [
      "Verwende einfache Sprache",
      "Nutze Analogien und Metaphern",
      "Erkläre es laut oder schriftlich",
      "Wenn du stecken bleibst, lerne mehr",
    ],
  },
  {
    name: "Blurting/Brain Dumping",
    icon: <FileText className="h-5 w-5" />,
    description: "Schreibe alles auf, was du über ein Thema weißt, ohne nachzudenken oder zu strukturieren.",
    howItWorks:
      "Nimm ein leeres Blatt und schreibe 10-15 Minuten alles auf, was dir zum Thema einfällt. Keine Struktur, einfach alles rausschreiben.",
    example:
      "Thema 'Zweiter Weltkrieg': Schreibe alles auf - Daten, Namen, Ereignisse, Ursachen - ohne Reihenfolge oder Struktur.",
    tips: [
      "Setze dir ein Zeitlimit (10-15 Min)",
      "Schreibe kontinuierlich, ohne zu stoppen",
      "Keine Sorge um Rechtschreibung oder Struktur",
      "Überprüfe danach, was du vergessen hast",
    ],
  },
  {
    name: "Reasoning",
    icon: <Search className="h-5 w-5" />,
    description: "Verstehe die logischen Zusammenhänge und das 'Warum' hinter den Fakten.",
    howItWorks:
      "Stelle dir immer die Fragen: Warum ist das so? Wie hängt das zusammen? Was sind die Ursachen und Folgen?",
    example:
      "Statt nur zu lernen 'Pflanzen brauchen Licht', frage: Warum brauchen sie Licht? Wie wandeln sie es um? Was passiert ohne Licht?",
    tips: [
      "Stelle immer 'Warum'-Fragen",
      "Suche nach Ursache-Wirkungs-Beziehungen",
      "Verbinde neue Info mit bekanntem Wissen",
      "Erstelle Concept Maps",
    ],
  },
  {
    name: "Mnemotechniken",
    icon: <Lightbulb className="h-5 w-5" />,
    description: "Gedächtnistricks und Eselsbrücken, um Informationen besser zu merken.",
    howItWorks:
      "Verwende Akronyme, Geschichten, Bilder oder Reime, um abstrakte Informationen in merkbare Formen zu verwandeln.",
    example:
      "Planeten-Reihenfolge: 'Mein Vater Erklärt Mir Jeden Sonntag Unsere Neun Planeten' (Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus, Neptun, Pluto)",
    tips: [
      "Verwende lebhafte, verrückte Bilder",
      "Erstelle persönliche Verbindungen",
      "Nutze Reime und Rhythmus",
      "Übe die Mnemotechniken regelmäßig",
    ],
  },
  {
    name: "SQ3R Methode",
    icon: <BookOpen className="h-5 w-5" />,
    description: "Survey, Question, Read, Recite, Review - Eine systematische Methode zum Textverständnis.",
    howItWorks:
      "1. Survey (Überblick) 2. Question (Fragen stellen) 3. Read (Lesen) 4. Recite (Wiedergeben) 5. Review (Wiederholen)",
    example:
      "Geschichtsbuch: 1. Überschriften scannen 2. 'Was waren die Ursachen des Krieges?' 3. Kapitel lesen 4. Zusammenfassung schreiben 5. Nach einer Woche wiederholen",
    tips: [
      "Nimm dir Zeit für jeden Schritt",
      "Stelle konkrete Fragen vor dem Lesen",
      "Mache Notizen beim Lesen",
      "Wiederhole regelmäßig",
    ],
  },
  {
    name: "Teaching",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Lehre anderen das Gelernte - durch Erklären festigst du dein eigenes Wissen.",
    howItWorks:
      "Erkläre das Gelernte einem Freund, Familienmitglied oder sogar einem Stofftier. Durch das Lehren erkennst du Wissenslücken.",
    example:
      "Nach dem Mathe-Unterricht erklärst du deinem kleinen Bruder, wie man Brüche addiert. Dabei merkst du, wo du selbst noch unsicher bist.",
    tips: [
      "Erkläre es so, als wäre dein Zuhörer ein Anfänger",
      "Verwende eigene Worte, nicht auswendig gelernte Sätze",
      "Stelle sicher, dass dein 'Schüler' es versteht",
      "Beantworte Fragen, die gestellt werden",
    ],
  },
  {
    name: "Chunking",
    icon: <Search className="h-5 w-5" />,
    description: "Teile große Informationsmengen in kleinere, überschaubare 'Chunks' (Häppchen) auf.",
    howItWorks:
      "Zerlege komplexe Themen in 5-7 kleinere Teile. Unser Gehirn kann nur begrenzt viele Informationen gleichzeitig verarbeiten.",
    example:
      "Statt eine 20-seitige Geschichte am Stück zu lernen, teile sie in 4 Abschnitte: Einführung, Konflikt, Höhepunkt, Lösung. Lerne jeden Teil einzeln.",
    tips: [
      "Maximal 7 Chunks pro Lerneinheit",
      "Verwende logische Gruppierungen",
      "Erstelle Überschriften für jeden Chunk",
      "Verbinde die Chunks miteinander",
    ],
  },
]

export function LearningMethodsInfo({ onUseMethod }: LearningMethodsInfoProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Lernmethoden - Wie sie funktionieren
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Hier findest du detaillierte Erklärungen zu allen Lernmethoden mit praktischen Beispielen und Tipps.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {learningMethodsData.map((method) => (
          <Card key={method.name} className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">{method.icon}</div>
                {method.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">Was ist das?</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">Wie funktioniert es?</h4>
                <p className="text-sm text-gray-600">{method.howItWorks}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">Beispiel:</h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">{method.example}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Tipps:</h4>
                <div className="space-y-1">
                  {method.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs px-2 py-0 mt-0.5">
                        {index + 1}
                      </Badge>
                      <p className="text-xs text-gray-600">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
