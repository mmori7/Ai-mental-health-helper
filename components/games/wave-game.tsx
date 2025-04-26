"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function WaveGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frequency, setFrequency] = useState(0.02)
  const [amplitude, setAmplitude] = useState(50)
  const [isPlaying, setIsPlaying] = useState(true)
  const requestRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    let time = 0

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw wave
      ctx.beginPath()

      for (let x = 0; x < canvas.width; x++) {
        const y =
          canvas.height / 2 +
          Math.sin(x * frequency + time) * amplitude +
          Math.sin(x * frequency * 0.5 + time * 1.5) * amplitude * 0.5

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.strokeStyle = "#0d9488"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw second wave (offset)
      ctx.beginPath()

      for (let x = 0; x < canvas.width; x++) {
        const y =
          canvas.height / 2 +
          Math.sin(x * frequency + time + Math.PI) * amplitude +
          Math.sin(x * frequency * 0.5 + time * 1.5 + Math.PI) * amplitude * 0.5

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.strokeStyle = "#0891b2"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw instructions
      ctx.fillStyle = "#475569"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(
        "Breathe in rhythm with the waves. Feel the harmony of the oscillations.",
        canvas.width / 2,
        canvas.height - 30,
      )

      time += 0.05
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [frequency, amplitude, isPlaying])

  const handleReset = () => {
    setIsPlaying(true)
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }
    requestRef.current = requestAnimationFrame(animate)
  }

  const animate = () => {
    if (!isPlaying || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let time = 0

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw wave
      ctx.beginPath()

      for (let x = 0; x < canvas.width; x++) {
        const y =
          canvas.height / 2 +
          Math.sin(x * frequency + time) * amplitude +
          Math.sin(x * frequency * 0.5 + time * 1.5) * amplitude * 0.5

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.strokeStyle = "#0d9488"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw second wave (offset)
      ctx.beginPath()

      for (let x = 0; x < canvas.width; x++) {
        const y =
          canvas.height / 2 +
          Math.sin(x * frequency + time + Math.PI) * amplitude +
          Math.sin(x * frequency * 0.5 + time * 1.5 + Math.PI) * amplitude * 0.5

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.strokeStyle = "#0891b2"
      ctx.lineWidth = 3
      ctx.stroke()

      time += 0.05

      if (isPlaying) {
        requestRef.current = requestAnimationFrame(renderFrame)
      }
    }

    renderFrame()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full bg-white rounded-md shadow-inner" />
      </div>
      <div className="mt-4 space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm min-w-[100px]">Wave Frequency:</span>
          <Slider
            value={[frequency * 1000]}
            min={5}
            max={50}
            step={1}
            onValueChange={(value) => setFrequency(value[0] / 1000)}
            className="flex-1"
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm min-w-[100px]">Wave Height:</span>
          <Slider
            value={[amplitude]}
            min={10}
            max={100}
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
