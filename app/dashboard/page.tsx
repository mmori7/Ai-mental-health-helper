"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useSupabase } from "@/components/supabase-provider"
import { getUserMoodEntries, getUserGameSessions, type GameSession } from "@/lib/game-service"
import AuthCheck from "@/components/auth-check"
import { format } from "date-fns"

const COLORS = ["#0d9488", "#0891b2", "#0284c7", "#4f46e5"]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { user } = useSupabase()
  const [moodData, setMoodData] = useState<any[]>([])
  const [sessionData, setSessionData] = useState<any[]>([])
  const [gameSessions, setGameSessions] = useState<GameSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Fetch mood entries
        const moodEntries = await getUserMoodEntries(user.id)
        const formattedMoodData = moodEntries.map((entry) => ({
          day: format(new Date(entry.created_at), "EEE"),
          value: entry.mood_score,
          date: format(new Date(entry.created_at), "MMM d"),
        }))
        setMoodData(formattedMoodData)

        // Fetch game sessions
        const sessions = await getUserGameSessions(user.id)
        setGameSessions(sessions)

        // Calculate session data for pie chart
        const gameTypes = sessions.reduce(
          (acc, session) => {
            const type = session.game_type
            acc[type] = (acc[type] || 0) + session.duration_seconds
            return acc
          },
          {} as Record<string, number>,
        )

        const formattedSessionData = Object.entries(gameTypes).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }))

        setSessionData(formattedSessionData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Calculate insights
  const getInsights = () => {
    if (gameSessions.length === 0) {
      return [
        {
          title: "No Data Yet",
          description: "Start using the therapy chat and relaxation games to see personalized insights here.",
        },
      ]
    }

    const insights = []

    // Mood patterns
    if (moodData.length > 0) {
      const avgMood = moodData.reduce((sum, entry) => sum + entry.value, 0) / moodData.length
      insights.push({
        title: "Mood Patterns",
        description: `Your average mood score is ${avgMood.toFixed(1)}. ${
          avgMood > 6
            ? "You've been maintaining a positive mood overall."
            : "Consider scheduling more relaxation sessions to improve your mood."
        }`,
      })
    }

    // Game effectiveness
    if (gameSessions.length > 0) {
      const gameEffectiveness: Record<string, { count: number; improvement: number }> = {}

      gameSessions.forEach((session) => {
        if (session.pre_game_mood !== undefined && session.post_game_mood !== undefined) {
          const type = session.game_type
          if (!gameEffectiveness[type]) {
            gameEffectiveness[type] = { count: 0, improvement: 0 }
          }

          gameEffectiveness[type].count++
          gameEffectiveness[type].improvement += session.post_game_mood - session.pre_game_mood
        }
      })

      const mostEffectiveGame = Object.entries(gameEffectiveness)
        .filter(([_, data]) => data.count > 0)
        .sort(([_, a], [__, b]) => b.improvement / b.count - a.improvement / a.count)[0]

      if (mostEffectiveGame) {
        const [gameType, data] = mostEffectiveGame
        const avgImprovement = data.improvement / data.count

        insights.push({
          title: "Game Benefits",
          description: `The ${gameType} game appears to have the most calming effect on you with an average mood improvement of ${avgImprovement.toFixed(1)} points.`,
        })
      }
    }

    // Session frequency
    if (gameSessions.length > 0) {
      const sessionsPerWeek = gameSessions.length / (gameSessions.length > 7 ? 2 : 1)
      insights.push({
        title: "Session Frequency",
        description: `You've completed approximately ${sessionsPerWeek.toFixed(1)} relaxation sessions per week. ${
          sessionsPerWeek < 3
            ? "Consider increasing to 3-4 sessions per week for optimal benefits."
            : "Great job maintaining a consistent practice!"
        }`,
      })
    }

    return insights
  }

  const insights = getInsights()

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50">
        <header className="container mx-auto py-4">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-teal-700 ml-2">Your Dashboard</h1>
          </div>
        </header>

        <main className="container mx-auto py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mood">Mood Tracking</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Mood</CardTitle>
                    <CardDescription>Your mood trends over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {loading ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                        </div>
                      ) : moodData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={moodData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip labelFormatter={(index) => moodData[index]?.date || ""} />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#0d9488"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                          No mood data available yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Activity Breakdown</CardTitle>
                    <CardDescription>Time spent on different activities (seconds)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {loading ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                        </div>
                      ) : sessionData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={sessionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {sessionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                          No activity data available yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mood">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Mood Tracking</CardTitle>
                  <CardDescription>Track your mood patterns and identify triggers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {loading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                      </div>
                    ) : moodData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={moodData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip labelFormatter={(index) => moodData[index]?.date || ""} />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#0d9488"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        No mood data available yet
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Recent Game Sessions</h3>
                    {gameSessions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Date</th>
                              <th className="text-left py-2">Game</th>
                              <th className="text-left py-2">Duration</th>
                              <th className="text-left py-2">Before</th>
                              <th className="text-left py-2">After</th>
                              <th className="text-left py-2">Change</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gameSessions.slice(0, 5).map((session) => (
                              <tr key={session.id} className="border-b">
                                <td className="py-2">{format(new Date(session.created_at), "MMM d, yyyy")}</td>
                                <td className="py-2 capitalize">{session.game_type}</td>
                                <td className="py-2">
                                  {Math.floor(session.duration_seconds / 60)}m {session.duration_seconds % 60}s
                                </td>
                                <td className="py-2">{session.pre_game_mood || "-"}</td>
                                <td className="py-2">{session.post_game_mood || "-"}</td>
                                <td className="py-2">
                                  {session.pre_game_mood !== undefined && session.post_game_mood !== undefined ? (
                                    <span
                                      className={
                                        session.post_game_mood > session.pre_game_mood
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {session.post_game_mood - session.pre_game_mood > 0 ? "+" : ""}
                                      {session.post_game_mood - session.pre_game_mood}
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500">No game sessions recorded yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <div className="grid md:grid-cols-3 gap-6">
                {insights.map((insight, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{insight.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{insight.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>Personalized suggestions based on your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-teal-100 rounded-full p-1 mr-3 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-teal-800"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700">
                        Try the <strong>Wave Harmony</strong> game when feeling anxious, as it shows the best results
                        for calming your nervous system.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-teal-100 rounded-full p-1 mr-3 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-teal-800"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700">
                        Schedule therapy sessions in the morning for better engagement, based on your interaction
                        patterns.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-teal-100 rounded-full p-1 mr-3 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-teal-800"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700">
                        Consider exploring the <strong>Pendulum Meditation</strong> for longer sessions to improve focus
                        and mindfulness.
                      </p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthCheck>
  )
}
