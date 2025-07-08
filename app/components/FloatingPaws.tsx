"use client"

import { useEffect, useState } from "react"

interface FloatingPaw {
    id: number
    x: number
    y: number
    size: number
    speed: number
    opacity: number
}

export default function FloatingPaws() {
    const [paws, setPaws] = useState<FloatingPaw[]>([])

    useEffect(() => {
        const newPaws: FloatingPaw[] = []

        for (let i = 0; i < 8; i++) {
            newPaws.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 20 + 10,
                speed: Math.random() * 20 + 10,
                opacity: Math.random() * 0.3 + 0.1,
            })
        }

        setPaws(newPaws)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {paws.map((paw) => (
                <div
                    key={paw.id}
                    className="absolute animate-float"
                    style={{
                        left: `${paw.x}%`,
                        top: `${paw.y}%`,
                        fontSize: `${paw.size}px`,
                        opacity: paw.opacity,
                        animationDuration: `${paw.speed}s`,
                        animationDelay: `${paw.id * 0.5}s`,
                    }}
                >
                    🐾
                </div>
            ))}
        </div>
    )
}
