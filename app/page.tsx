"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Brain, Gamepad2, LineChart } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { useEffect, useState } from "react"

export default function Home() {
  const { supabase, user: supabaseUser, loading: supabaseLoading } = useSupabase()
  const [user, setUser] = useState(supabaseUser)
  const [loading, setLoading] = useState(supabaseLoading)

  useEffect(() => {
    setUser(supabaseUser)
    setLoading(supabaseLoading)
  }, [supabaseUser, supabaseLoading])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50">
      <header className="container mx-auto py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-700">MindPhysics</h1>
          <div className="flex gap-4">
            {loading ? (
              <div className="animate-pulse h-10 w-20 bg-gray-200 rounded"></div>
            ) : user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-teal-800 mb-4">AI-Powered Mental Wellness</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience therapeutic conversations with our AI that combines principles of physics and psychology for a
            unique approach to mental health.
          </p>
          <div className="mt-8">
            <Link href={user ? "/chat" : "/signup"}>
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                {user ? "Start Therapy Session" : "Get Started"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Brain className="h-12 w-12 text-teal-600 mb-2" />
              <CardTitle>AI Therapy</CardTitle>
              <CardDescription>
                Chat with our AI therapist trained in physics-based mental health approaches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our AI combines principles of physics with psychological techniques to provide a unique therapeutic
                experience.
              </p>
            </CardContent>
            <CardFooter>
              <Link href={user ? "/chat" : "/signup"}>
                <Button variant="outline">Try Now</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Gamepad2 className="h-12 w-12 text-teal-600 mb-2" />
              <CardTitle>Relaxation Games</CardTitle>
              <CardDescription>Interactive physics-based games designed to reduce stress and anxiety</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Engage with calming games that use physics principles to create a meditative and relaxing experience.
              </p>
            </CardContent>
            <CardFooter>
              <Link href={user ? "/games" : "/signup"}>
                <Button variant="outline">Play Games</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <LineChart className="h-12 w-12 text-teal-600 mb-2" />
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Monitor your mental health journey with detailed analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track your mood patterns, session insights, and progress over time with our comprehensive dashboard.
              </p>
            </CardContent>
            <CardFooter>
              <Link href={user ? "/dashboard" : "/signup"}>
                <Button variant="outline">View Dashboard</Button>
              </Link>
            </CardFooter>
          </Card>
        </section>

        <section className="bg-white rounded-xl p-8 shadow-md mb-16">
          <h2 className="text-3xl font-bold text-teal-800 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-700">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account and complete a brief assessment</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-700">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat & Play</h3>
              <p className="text-gray-600">Engage with our AI therapist and relaxation games</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-700">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your mental wellness journey over time</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-teal-800 text-white py-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MindPhysics</h3>
              <p>AI-powered mental health therapy with a physics-based approach.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="hover:underline">
                    Therapy Chat
                  </Link>
                </li>
                <li>
                  <Link href="/games" className="hover:underline">
                    Relaxation Games
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p>support@mindphysics.ai</p>
              <p className="mt-4 text-sm">© 2025 MindPhysics. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
