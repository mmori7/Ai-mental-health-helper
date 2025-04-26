"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  created_at?: string
}

export function useChat() {
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  // Create or get the current therapy session
  useEffect(() => {
    const createSession = async () => {
      if (!user) return

      try {
        // Check for an active session
        const { data: existingSessions } = await supabase
          .from("therapy_sessions")
          .select("id")
          .eq("user_id", user.id)
          .is("ended_at", null)
          .order("created_at", { ascending: false })
          .limit(1)

        if (existingSessions && existingSessions.length > 0) {
          setSessionId(existingSessions[0].id)

          // Load messages for this session
          const { data: sessionMessages } = await supabase
            .from("messages")
            .select("*")
            .eq("session_id", existingSessions[0].id)
            .order("created_at", { ascending: true })

          if (sessionMessages) {
            setMessages(
              sessionMessages.map((msg) => ({
                id: msg.id,
                role: msg.role as "user" | "assistant",
                content: msg.content,
                created_at: msg.created_at,
              })),
            )
          }
        } else {
          // Create a new session
          const newSessionId = uuidv4()
          const { error } = await supabase.from("therapy_sessions").insert({
            id: newSessionId,
            user_id: user.id,
          })

          if (error) {
            console.error("Error creating session:", error)
            return
          }

          setSessionId(newSessionId)

          // Add welcome message
          const welcomeMessage: Message = {
            id: uuidv4(),
            role: "assistant",
            content:
              "Welcome to your therapy session. I'm your AI therapist with a background in physics and psychology. How are you feeling today?",
          }

          setMessages([welcomeMessage])

          // Save welcome message
          await supabase.from("messages").insert({
            id: welcomeMessage.id,
            session_id: newSessionId,
            role: welcomeMessage.role,
            content: welcomeMessage.content,
          })
        }
      } catch (error) {
        console.error("Error setting up chat session:", error)
        toast({
          title: "Error",
          description: "Failed to set up chat session",
          variant: "destructive",
        })
      }
    }

    createSession()
  }, [user, supabase, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !sessionId || !user) return

    // Add user message
    const userMessageId = uuidv4()
    const userMessage: Message = { id: userMessageId, role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Save user message to database
      await supabase.from("messages").insert({
        id: userMessageId,
        session_id: sessionId,
        role: userMessage.role,
        content: userMessage.content,
      })

      // In a real implementation, this would call your AI API
      // For now, we'll simulate a response
      setTimeout(async () => {
        const therapyResponses = [
          "I notice you're feeling that way. From a physics perspective, emotions are like energy - they can't be destroyed, only transformed. Let's work on transforming this energy into something positive.",
          "That's interesting. In physics, we talk about equilibrium. Your mind seeks emotional equilibrium too. What activities help you restore balance?",
          "I understand. Think of your thoughts like particles in motion - they have momentum. Let's work on redirecting that momentum in a healthier direction.",
          "From both physics and psychology perspectives, resistance often leads to persistence. What if we practice acceptance of these feelings while creating space for change?",
          "Your emotions, like energy in physics, follow certain patterns. Have you noticed any patterns in when these feelings arise?",
        ]

        const randomResponse = therapyResponses[Math.floor(Math.random() * therapyResponses.length)]
        const aiMessageId = uuidv4()
        const aiMessage: Message = { id: aiMessageId, role: "assistant", content: randomResponse }

        setMessages((prev) => [...prev, aiMessage])

        // Save AI message to database
        await supabase.from("messages").insert({
          id: aiMessageId,
          session_id: sessionId,
          role: aiMessage.role,
          content: aiMessage.content,
        })

        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const endSession = async () => {
    if (!sessionId || !user) return

    try {
      await supabase.from("therapy_sessions").update({ ended_at: new Date().toISOString() }).eq("id", sessionId)

      toast({
        title: "Session Ended",
        description: "Your therapy session has been saved",
      })

      // Create a new session for next time
      setSessionId(null)
      setMessages([])
    } catch (error) {
      console.error("Error ending session:", error)
      toast({
        title: "Error",
        description: "Failed to end session",
        variant: "destructive",
      })
    }
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    endSession,
  }
}
