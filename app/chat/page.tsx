"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Send, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useChat } from "@/hooks/use-chat"
import AuthCheck from "@/components/auth-check"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, endSession } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 flex flex-col">
        <header className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-teal-700 ml-2">Therapy Session</h1>
            </div>
            <Button variant="outline" onClick={endSession}>
              <Save className="h-4 w-4 mr-2" /> End Session
            </Button>
          </div>
        </header>

        <div className="flex-1 container mx-auto py-4 flex flex-col">
          <Card className="flex-1 overflow-hidden flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-start max-w-[80%]">
                      {message.role !== "user" && (
                        <Avatar className="h-8 w-8 mr-2 bg-teal-600">
                          <span className="text-xs">AI</span>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 ml-2 bg-gray-300">
                          <span className="text-xs">You</span>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </AuthCheck>
  )
}
