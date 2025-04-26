"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

export default function ParticleGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particleCount, setParticleCount] = useState(50)
  const [isPlaying, setIsPlaying] = useState(true)
  const requestRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = []
      const colors = ["#0d9488", "#0891b2", "#0284c7", "#4f46e5", "#7c3aed"]

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      particlesRef.current = particles
    }

    initParticles()

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off walls
        if (particle.x < particle.radius || particle.x > canvas.width - particle.radius) {
          particle.vx *= -1
        }

        if (particle.y < particle.radius || particle.y > canvas.height - particle.radius) {
          particle.vy *= -1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      // Draw connections between nearby particles
      particlesRef.current.forEach((particle, i) => {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const otherParticle = particlesRef.current[j]
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(13, 148, 136, ${1 - distance / 100})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      // Draw instructions
      ctx.fillStyle = "#475569"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(
        "Watch the particles flow. Focus on their movement and connections.",
        canvas.width / 2,
        canvas.height - 30,
      )

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [particleCount, isPlaying])

  const handleReset = () => {
    setIsPlaying(true)
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Reinitialize particles
        const colors = ["#0d9488", "#0891b2", "#0284c7", "#4f46e5", "#7c3aed"]
        const particles: Particle[] = []

        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
          })
        }

        particlesRef.current = particles

        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
        requestRef.current = requestAnimationFrame(animate)
      }
    }
  }

  const animate = () => {
    if (!isPlaying || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off walls
      if (particle.x < particle.radius || particle.x > canvas.width - particle.radius) {
        particle.vx *= -1
      }

      if (particle.y < particle.radius || particle.y > canvas.height - particle.radius) {
        particle.vy *= -1
      }

      // Draw particle
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.fill()
    })

    // Draw connections
    particlesRef.current.forEach((particle, i) => {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const otherParticle = particlesRef.current[j]
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.strokeStyle = `rgba(13, 148, 136, ${1 - distance / 100})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    })

    requestRef.current = requestAnimationFrame(animate)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full bg-white rounded-md shadow-inner" />
      </div>
      <div className="mt-4 space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm min-w-[100px]">Particle Count:</span>
          <Slider
            value={[particleCount]}
            min={10}
            max={100}
            step={1}
            onValueChange={(value) => setParticleCount(value[0])}
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
