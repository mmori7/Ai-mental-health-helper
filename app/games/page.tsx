"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import PendulumGame from "@/components/games/pendulum-game"
import ParticleGame from "@/components/games/particle-game"
import WaveGame from "@/components/games/wave-game"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import { saveGameSession } from "@/lib/game-service"
import AuthCheck from "@/components/auth-check"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState("pendulum")
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [showPreGameDialog, setShowPreGameDialog] = useState(false)
  const [showPostGameDialog, setShowPostGameDialog] = useState(false)
  const [preGameMood, setPreGameMood] = useState<number | undefined>(undefined)
  const [postGameMood, setPostGameMood] = useState<number | undefined>(undefined)
  const { user } = useSupabase()
  const { toast } = useToast()

  useEffect(() => {
    // Show pre-game mood dialog when component mounts
    setShowPreGameDialog(true)
  }, [])

  useEffect(() => {
    // Start timer when pre-game mood is set
    if (preGameMood !== undefined) {
      setStartTime(new Date())
    }
  }, [preGameMood])

  const handleTabChange = (value: string) => {
    if (startTime) {
      // Save the previous game session
      handleEndGame()
    }

    setActiveTab(value)
    setStartTime(new Date())
  }

  const handleEndGame = async () => {
    if (!startTime || !user || preGameMood === undefined) return

    const endTime = new Date()
    const durationSeconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000)

    // Show post-game mood dialog
    setShowPostGameDialog(true)
  }

  const saveSession = async () => {
    if (!startTime || !user || preGameMood === undefined || postGameMood === undefined) return

    const endTime = new Date()
    const durationSeconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000)

    try {
      const gameType = activeTab as "pendulum" | "particles" | "waves"
      await saveGameSession(user.id, gameType, durationSeconds, preGameMood, postGameMood)

      toast({
        title: "Session Saved",
        description: "Your game session has been recorded",
      })

      // Reset for next game
      setStartTime(new Date())
      setPreGameMood(postGameMood) // Use post-game mood as pre-game mood for next session
      setPostGameMood(undefined)
    } catch (error) {
      console.error("Error saving game session:", error)
      toast({
        title: "Error",
        description: "Failed to save game session",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50">
        <header className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-teal-700 ml-2">Relaxation Games</h1>
            </div>
            <Button variant="outline" onClick={handleEndGame}>
              End Current Game
            </Button>
          </div>
        </header>

        <main className="container mx-auto py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Physics-Based Relaxation Games</CardTitle>
                <CardDescription>
                  Interact with these physics simulations to reduce stress and promote mindfulness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="pendulum">Pendulum Meditation</TabsTrigger>
                    <TabsTrigger value="particles">Particle Flow</TabsTrigger>
                    <TabsTrigger value="waves">Wave Harmony</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pendulum" className="h-[400px]">
                    <PendulumGame />
                  </TabsContent>
                  <TabsContent value="particles" className="h-[400px]">
                    <ParticleGame />
                  </TabsContent>
                  <TabsContent value="waves" className="h-[400px]">
                    <WaveGame />
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">
                  These games use physics principles to create calming, meditative experiences.
                </p>
                <Link href="/dashboard">
                  <Button variant="outline">View Your Progress</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </main>

        {/* Pre-game mood dialog */}
        <Dialog open={showPreGameDialog} onOpenChange={setShowPreGameDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How are you feeling?</DialogTitle>
              <DialogDescription>Rate your current mood before starting the relaxation game.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <RadioGroup
                value={preGameMood?.toString()}
                onValueChange={(value) => setPreGameMood(Number.parseInt(value))}
              >
                <div className="flex justify-between px-1">
                  <span className="text-sm text-gray-500">Low</span>
                  <span className="text-sm text-gray-500">High</span>
                </div>
                <div className="flex justify-between space-x-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <div key={value} className="flex flex-col items-center">
                      <RadioGroupItem value={value.toString()} id={`mood-${value}`} className="peer sr-only" />
                      <Label
                        htmlFor={`mood-${value}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 peer-data-[state=checked]:bg-teal-600 peer-data-[state=checked]:text-white cursor-pointer"
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowPreGameDialog(false)} disabled={preGameMood === undefined}>
                Start Game
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Post-game mood dialog */}
        <Dialog open={showPostGameDialog} onOpenChange={setShowPostGameDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How do you feel now?</DialogTitle>
              <DialogDescription>Rate your mood after playing the relaxation game.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <RadioGroup
                value={postGameMood?.toString()}
                onValueChange={(value) => setPostGameMood(Number.parseInt(value))}
              >
                <div className="flex justify-between px-1">
                  <span className="text-sm text-gray-500">Low</span>
                  <span className="text-sm text-gray-500">High</span>
                </div>
                <div className="flex justify-between space-x-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <div key={value} className="flex flex-col items-center">
                      <RadioGroupItem value={value.toString()} id={`post-mood-${value}`} className="peer sr-only" />
                      <Label
                        htmlFor={`post-mood-${value}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 peer-data-[state=checked]:bg-teal-600 peer-data-[state=checked]:text-white cursor-pointer"
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  saveSession()
                  setShowPostGameDialog(false)
                }}
                disabled={postGameMood === undefined}
              >
                Save Results
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthCheck>
  )
}
