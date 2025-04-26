"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function PendulumGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [amplitude, setAmplitude] = useState(100)
  const [isPlaying, setIsPlaying] = useState(true)
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    const pendulumLength = amplitude
    const gravity = 9.8
    const damping = 0.995
    let angle = Math.PI / 4 // Initial angle
    let angleVelocity = 0
    let angleAcceleration = 0

    const centerX = canvas.width / 2
    const centerY = canvas.height / 3

    const animate = (time: number) => {
      if (!isPlaying) {
        previousTimeRef.current = undefined
        return
      }

      if (previousTimeRef.current !== undefined) {
        const deltaTime = (time - previousTimeRef.current) / 1000

        // Physics calculation
        angleAcceleration = (-gravity / pendulumLength) * Math.sin(angle)
        angleVelocity += angleAcceleration * deltaTime
        angleVelocity *= damping
        angle += angleVelocity * deltaTime

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw pendulum
        const bobX = centerX + pendulumLength * Math.sin(angle)
        const bobY = centerY + pendulumLength * Math.cos(angle)

        // Draw string
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(bobX, bobY)
        ctx.strokeStyle = "#0d9488"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw bob
        ctx.beginPath()
        ctx.arc(bobX, bobY, 20, 0, Math.PI * 2)
        ctx.fillStyle = "#0d9488"
        ctx.fill()

        // Draw instructions
        ctx.fillStyle = "#475569"
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText(
          "Focus on the pendulum's motion. Breathe in as it swings one way, out as it returns.",
          canvas.width / 2,
          canvas.height - 30,
        )
      }

      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [amplitude, isPlaying])

  const handleReset = () => {
    setIsPlaying(true)
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }
    requestRef.current = requestAnimationFrame((time) => {
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame((nextTime) => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d")
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          }
        }
        previousTimeRef.current = nextTime
      })
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full bg-white rounded-md shadow-inner" />
      </div>
      <div className="mt-4 space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm min-w-[100px]">Pendulum Length:</span>
          <Slider
            value={[amplitude]}
            min={50}
            max={150}
            step={1}
            onValueChange={(value) => setAmplitude(value[0])}
            className="flex-1"
          />
        </div>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </div>
      </div>
    </div>
  )
}
