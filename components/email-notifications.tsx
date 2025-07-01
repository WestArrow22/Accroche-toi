"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Mail, Bell, Calendar, Clock, BookOpen, FileText, AlertCircle } from "lucide-react"

interface EmailNotificationSettings {
  email: string
  enabled: boolean
  studyReminders: boolean
  homeworkReminders: boolean
  examReminders: boolean
  dailyDigest: boolean
}

interface EmailNotificationsProps {
  studentId: string
  settings: EmailNotificationSettings
  onUpdateSettings: (settings: EmailNotificationSettings) => void
}

export function EmailNotifications({ studentId, settings, onUpdateSettings }: EmailNotificationsProps) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [testEmailSent, setTestEmailSent] = useState(false)

  const handleSave = () => {
    onUpdateSettings(localSettings)
    alert("E-Mail Einstellungen gespeichert!")
  }

  const sendTestEmail = () => {
    // In einer echten Implementierung würde hier eine E-Mail gesendet
    console.log("Test E-Mail senden an:", localSettings.email)
    setTestEmailSent(true)
    setTimeout(() => setTestEmailSent(false), 3000)

    // Simuliere E-Mail Versand
    alert(`Test-E-Mail wurde an ${localSettings.email} gesendet! 📧`)
  }

  const generateICalLink = () => {
    // Generiere einen iCal/ICS Link für Kalender-Integration
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Accroche-toi//Lernkalender//DE
BEGIN:VEVENT
UID:test-${Date.now()}@accroche-toi.app
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:Accroche-toi Lerntermin
DESCRIPTION:Automatisch generierter Lerntermin
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "accroche-toi-kalender.ics"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          E-Mail Benachrichtigungen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* E-Mail Adresse */}
        <div>
          <Label htmlFor="email">E-Mail Adresse</Label>
          <Input
            id="email"
            type="email"
            placeholder="deine.email@beispiel.com"
            value={localSettings.email}
            onChange={(e) => setLocalSettings({ ...localSettings, email: e.target.value })}
          />
        </div>

        {/* Haupt-Schalter */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">E-Mail Benachrichtigungen aktivieren</h4>
            <p className="text-sm text-gray-600">Erhalte automatische Erinnerungen per E-Mail</p>
          </div>
          <Switch
            checked={localSettings.enabled}
            onCheckedChange={(enabled) => setLocalSettings({ ...localSettings, enabled })}
          />
        </div>

        {/* Detaillierte Einstellungen */}
        {localSettings.enabled && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <div>
                  <span className="font-medium">Lerntermine</span>
                  <p className="text-xs text-gray-600">Spaced Repetition Erinnerungen</p>
                </div>
              </div>
              <Switch
                checked={localSettings.studyReminders}
                onCheckedChange={(studyReminders) => setLocalSettings({ ...localSettings, studyReminders })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <div>
                  <span className="font-medium">Hausaufgaben Priming</span>
                  <p className="text-xs text-gray-600">1 Tag vorher Erinnerung</p>
                </div>
              </div>
              <Switch
                checked={localSettings.homeworkReminders}
                onCheckedChange={(homeworkReminders) => setLocalSettings({ ...localSettings, homeworkReminders })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div>
                  <span className="font-medium">Prüfungserinnerungen</span>
                  <p className="text-xs text-gray-600">Wichtige Prüfungstermine</p>
                </div>
              </div>
              <Switch
                checked={localSettings.examReminders}
                onCheckedChange={(examReminders) => setLocalSettings({ ...localSettings, examReminders })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <div>
                  <span className="font-medium">Tägliche Zusammenfassung</span>
                  <p className="text-xs text-gray-600">Morgendliche Übersicht</p>
                </div>
              </div>
              <Switch
                checked={localSettings.dailyDigest}
                onCheckedChange={(dailyDigest) => setLocalSettings({ ...localSettings, dailyDigest })}
              />
            </div>
          </div>
        )}

        {/* Kalender Integration */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Kalender Integration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" onClick={generateICalLink} className="flex items-center gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              .ics Datei herunterladen
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              Google Calendar
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Importiere deine Lerntermine in deinen bevorzugten Kalender</p>
        </div>

        {/* Aktionen */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Einstellungen speichern
          </Button>
          <Button variant="outline" onClick={sendTestEmail} disabled={!localSettings.email || !localSettings.enabled}>
            {testEmailSent ? (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Test gesendet!
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Test E-Mail
              </>
            )}
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2">📧 Wie funktionieren die E-Mail Benachrichtigungen?</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>Lerntermine:</strong> Automatische Erinnerungen basierend auf Spaced Repetition
            </li>
            <li>
              • <strong>Hausaufgaben Priming:</strong> 1 Tag vorher zur Wiederholung
            </li>
            <li>
              • <strong>Prüfungen:</strong> Rechtzeitige Vorbereitung (7-10 Tage vorher)
            </li>
            <li>
              • <strong>Tägliche Zusammenfassung:</strong> Morgendliche Übersicht deiner Termine
            </li>
          </ul>
        </div>

        {/* Status */}
        {localSettings.enabled && localSettings.email && (
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600">
              <Bell className="h-3 w-3 mr-1" />
              Aktiv
            </Badge>
            <span className="text-sm text-gray-600">Benachrichtigungen werden an {localSettings.email} gesendet</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
