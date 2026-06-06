'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  opacityDelta: number
  color: string
}

const COLORS = [
  'rgba(167, 139, 250,', // crystal purple
  'rgba(196, 181, 253,', // light purple
  'rgba(251, 207, 232,', // pink
  'rgba(254, 243, 199,', // golden
  'rgba(255, 255, 255,', // white
]

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.1,
      opacity: Math.random() * 0.6 + 0.2,
      opacityDelta: (Math.random() - 0.5) * 0.008,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })

    for (let i = 0; i < 60; i++) {
      particles.push(createParticle())
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        // Update position
        p.x += p.speedX
        p.y += p.speedY
        p.opacity += p.opacityDelta

        // Bounce opacity
        if (p.opacity >= 0.8 || p.opacity <= 0.1) {
          p.opacityDelta *= -1
        }

        // Reset if out of bounds
        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          particles[i] = { ...createParticle(), y: canvas.height + 10 }
        }

        // Draw glowing dot
        ctx.save()
        ctx.globalAlpha = p.opacity
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5)
        gradient.addColorStop(0, `${p.color} 1)`)
        gradient.addColorStop(1, `${p.color} 0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
