import { createBrowserClient } from "./supabase"

export type GameSession = {
  id: string
  user_id: string
  game_type: "pendulum" | "particles" | "waves"
  duration_seconds: number
  pre_game_mood?: number
  post_game_mood?: number
  created_at: string
}

export async function saveGameSession(
  userId: string,
  gameType: "pendulum" | "particles" | "waves",
  durationSeconds: number,
  preGameMood?: number,
  postGameMood?: number,
) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("game_sessions")
    .insert({
      user_id: userId,
      game_type: gameType,
      duration_seconds: durationSeconds,
      pre_game_mood: preGameMood,
      post_game_mood: postGameMood,
    })
    .select()

  if (error) {
    throw new Error(`Error saving game session: ${error.message}`)
  }

  return data[0] as GameSession
}

export async function getUserGameSessions(userId: string) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Error fetching game sessions: ${error.message}`)
  }

  return data as GameSession[]
}

export async function saveMoodEntry(userId: string, moodScore: number, notes?: string) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("mood_entries")
    .insert({
      user_id: userId,
      mood_score: moodScore,
      notes: notes,
    })
    .select()

  if (error) {
    throw new Error(`Error saving mood entry: ${error.message}`)
  }

  return data[0]
}

export async function getUserMoodEntries(userId: string, limit = 7) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Error fetching mood entries: ${error.message}`)
  }

  return data
}
