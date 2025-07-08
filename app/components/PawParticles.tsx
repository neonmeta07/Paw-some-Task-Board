"use client"

import { useEffect, useState } from "react"

interface Particle {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    life: number
    emoji: string
}

export default function PawParticles() {
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        const emojis = ["🐾", "⭐", "✨", "🎉", "💫", "🌟"]
        const newParticles: Particle[] = []

        // Create initial particles
        for (let i = 0; i < 20; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
            })
        }

        setParticles(newParticles)

        const interval = setInterval(() => {
            setParticles((prev) =>
                prev
                    .map((particle) => ({
                        ...particle,
                        x: particle.x + particle.vx,
                        y: particle.y + particle.vy,
                        life: particle.life - 0.02,
                    }))
                    .filter((particle) => particle.life > 0),
            )
        }, 50)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-40">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute text-2xl animate-bounce"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        opacity: particle.life,
                        transform: `scale(${particle.life})`,
                        transition: "all 0.1s ease-out",
                    }}
                >
                    {particle.emoji}
                </div>
            ))}
        </div>
    )
}
