"use client"
import supabase from '@/lib/supabaseClient'

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, User, GraduationCap } from "lucide-react"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderType: "teacher" | "student"
  message: string
  timestamp: string
}

interface ClassChatProps {
  currentUserId: string
  currentUserName: string
  currentUserType: "teacher" | "student"
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
}

export function ClassChat({
  currentUserId,
  currentUserName,
  currentUserType,
}: {
  currentUserId: string
  currentUserName: string
  currentUserType: "teacher" | "student"
}) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll zu neuen Nachrichten
  useEffect(() => {
  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error("Fehler beim Laden der Nachrichten:", error.message)
    } else {
      setMessages(data as ChatMessage[])
    }
    setLoading(false)
  }

  loadMessages()
}, [])

useEffect(() => {
  const channel = supabase
    .channel('chat-room')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
    }, (payload) => {
      setMessages((prev) => [...prev, payload.new as ChatMessage])
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])

  const handleSendMessage = async () => {
  if (newMessage.trim() === "") return

  const { data, error } = await supabase.from("chat_messages").insert([
    {
      sender_id: currentUserId,
      sender_name: currentUserName,
      sender_type: currentUserType,
      message: newMessage.trim(),
    },
  ])

  if (error) {
    console.error("Fehler beim Senden der Nachricht:", error.message)
  } else {
    setNewMessage("")
    // Optional: Push direkt in local messages, oder warten auf Realtime
  }
}

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Heute"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Gestern"
    } else {
      return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
      })
    }
  }

  // Gruppiere Nachrichten nach Datum
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    },
    {} as Record<string, ChatMessage[]>,
  )

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Klassen-Chat
          <Badge variant="outline" className="ml-auto">
            {messages.length} Nachrichten
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date}>
                {/* Datum-Trenner */}
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                    {formatDate(dayMessages[0].timestamp)}
                  </div>
                </div>

                {/* Nachrichten des Tages */}
                {dayMessages.map((message) => {
                  const isOwnMessage = message.senderId === currentUserId
                  const isTeacher = message.senderType === "teacher"

                  return (
                    <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-3`}>
                      <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : "order-1"}`}>
                        {/* Sender Info */}
                        {!isOwnMessage && (
                          <div className="flex items-center gap-1 mb-1">
                            {isTeacher ? (
                              <GraduationCap className="h-3 w-3 text-purple-600" />
                            ) : (
                              <User className="h-3 w-3 text-blue-600" />
                            )}
                            <span className={`text-xs font-medium ${isTeacher ? "text-purple-600" : "text-blue-600"}`}>
                              {message.senderName}
                            </span>
                            {isTeacher && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                Lehrer
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            isOwnMessage
                              ? "bg-blue-600 text-white"
                              : isTeacher
                                ? "bg-purple-100 text-purple-900 border border-purple-200"
                                : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwnMessage ? "text-blue-100" : isTeacher ? "text-purple-600" : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Noch keine Nachrichten</p>
                <p className="text-gray-400 text-sm">
                  {currentUserType === "teacher"
                    ? "Starte eine Unterhaltung mit deinen Schülern!"
                    : "Stelle eine Frage oder teile etwas mit der Klasse!"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder={
                currentUserType === "teacher"
                  ? "Nachricht an die Klasse..."
                  : "Frage stellen oder Nachricht schreiben..."
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Drücke Enter zum Senden • Shift+Enter für neue Zeile</p>
        </div>
      </CardContent>
    </Card>
  )
}
