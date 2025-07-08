"use client"

import { useState, useEffect } from "react"
import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"
import StickerGallery from "./components/StickerGallery"
import PawParticles from "./components/PawParticles"
import FloatingPaws from "./components/FloatingPaws"
import { Button } from "./components/ui/button"
import { Gift, Sparkles, Volume2, VolumeX, Zap } from "lucide-react"

interface Task {
    id: string
    description: string
    completed: boolean
    order: number
    createdAt?: string
}

interface Sticker {
    id: string
    name: string
    unlocked: boolean
    animation: string
}

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [stickers, setStickers] = useState<Sticker[]>([])
    const [showStickerGallery, setShowStickerGallery] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [showParticles, setShowParticles] = useState(false)
    const [streak, setStreak] = useState(0)
    const [totalCompleted, setTotalCompleted] = useState(0)
    const [showMotivation, setShowMotivation] = useState(false)

    // Motivational messages
    const motivationalMessages = [
        "You're on fire! 🔥",
        "Paw-some progress! 🐾",
        "Keep it up, superstar! ⭐",
        "You're crushing it! 💪",
        "Amazing work! 🎉",
        "Unstoppable! 🚀",
    ]

    // Initialize stickers and stats
    useEffect(() => {
        const initialStickers = [
            { id: "1", name: "Bouncy Bunny", unlocked: false, animation: "bounce" },
            { id: "2", name: "Happy Puppy", unlocked: false, animation: "wag" },
            { id: "3", name: "Sleepy Kitten", unlocked: false, animation: "purr" },
            { id: "4", name: "Dancing Panda", unlocked: false, animation: "dance" },
            { id: "5", name: "Jumping Fox", unlocked: false, animation: "jump" },
        ]

        try {
            const savedStickers = localStorage.getItem("pawsome-stickers")
            const savedStats = localStorage.getItem("pawsome-stats")

            if (savedStickers) {
                setStickers(JSON.parse(savedStickers))
            } else {
                setStickers(initialStickers)
                localStorage.setItem("pawsome-stickers", JSON.stringify(initialStickers))
            }

            if (savedStats) {
                const stats = JSON.parse(savedStats)
                setStreak(stats.streak || 0)
                setTotalCompleted(stats.totalCompleted || 0)
            }
        } catch (err) {
            console.error("Error loading data:", err)
            setStickers(initialStickers)
        }
    }, [])

    // Load tasks
    useEffect(() => {
        fetchTasks()
    }, [])

    const playSound = (type: "complete" | "add" | "delete" | "unlock") => {
        if (!soundEnabled) return

        try {
            // Create audio context for sound effects
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            switch (type) {
                case "complete":
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
                    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
                    break
                case "add":
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
                    break
                case "delete":
                    oscillator.frequency.setValueAtTime(220, audioContext.currentTime) // A3
                    break
                case "unlock":
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
                    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
                    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
                    break
            }

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.3)
        } catch (err) {
            console.log("Audio not supported:", err)
        }
    }

    const fetchTasks = async () => {
        try {
            setError(null)
            console.log("[UI] Fetching tasks...")
            const response = await fetch("/api/tasks")
            if (response.ok) {
                const data = await response.json()
                console.log("[UI] Fetched tasks:", data)
                setTasks(data.sort((a: Task, b: Task) => a.order - b.order))
            } else {
                throw new Error("Failed to fetch tasks")
            }
        } catch (error) {
            console.error("[UI] Error fetching tasks:", error)
            setError("Failed to load tasks. Please refresh the page.")
        } finally {
            setLoading(false)
        }
    }

    const addTask = async (description: string) => {
        try {
            setError(null)
            console.log("[UI] Adding task:", description)
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
            })

            if (response.ok) {
                const newTask = await response.json()
                console.log("[UI] Task added:", newTask)
                setTasks((prev) => [...prev, newTask])
                playSound("add")

                // Show brief motivation for adding tasks
                if (Math.random() > 0.7) {
                    setShowMotivation(true)
                    setTimeout(() => setShowMotivation(false), 2000)
                }
            } else {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to add task")
            }
        } catch (error) {
            console.error("[UI] Error adding task:", error)
            setError("Failed to add task. Please try again.")
        }
    }

    const updateTask = async (id: string, updates: Partial<Task>) => {
        try {
            setError(null)
            console.log(`[UI] Updating task ${id} with:`, updates)

            const response = await fetch(`/api/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            })

            if (response.ok) {
                const updatedTask = await response.json()
                console.log("[UI] Task updated successfully:", updatedTask)

                setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))

                // If task was completed, unlock a sticker and update stats
                if (updates.completed && !tasks.find((t) => t.id === id)?.completed) {
                    const newStreak = streak + 1
                    const newTotal = totalCompleted + 1

                    setStreak(newStreak)
                    setTotalCompleted(newTotal)

                    // Save stats
                    localStorage.setItem(
                        "pawsome-stats",
                        JSON.stringify({
                            streak: newStreak,
                            totalCompleted: newTotal,
                        }),
                    )

                    playSound("complete")
                    setShowParticles(true)
                    setTimeout(() => setShowParticles(false), 3000)

                    unlockRandomSticker()

                    // Show motivation for streaks
                    if (newStreak % 3 === 0) {
                        setShowMotivation(true)
                        setTimeout(() => setShowMotivation(false), 3000)
                    }
                }
            } else {
                const errorData = await response.json()
                console.error("[UI] Update failed:", errorData)
                throw new Error(errorData.error || "Failed to update task")
            }
        }
        catch (error: unknown) {
            console.error("[UI] Error updating task:", error);
            const message = error instanceof Error ? error.message : "Unknown error";
            setError(`Failed to update task: ${message}`);
        }
    }

    const deleteTask = async (id: string) => {
        try {
            setError(null)
            const response = await fetch(`/api/tasks/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setTasks((prev) => prev.filter((task) => task.id !== id))
                playSound("delete")
            } else {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to delete task")
            }
        } catch (error) {
            console.error("[UI] Error deleting task:", error)
            setError("Failed to delete task. Please try again.")
        }
    }

    const reorderTasks = async (newTasks: Task[]) => {
        setTasks(newTasks)

        try {
            setError(null)
            const response = await fetch("/api/tasks/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tasks: newTasks }),
            })

            if (!response.ok) {
                fetchTasks()
                throw new Error("Failed to reorder tasks")
            }
        } catch (error) {
            console.error("[UI] Error reordering tasks:", error)
            setError("Failed to reorder tasks. Order has been reverted.")
        }
    }

    const unlockRandomSticker = () => {
        const lockedStickers = stickers.filter((s) => !s.unlocked)
        if (lockedStickers.length === 0) return

        const randomSticker = lockedStickers[Math.floor(Math.random() * lockedStickers.length)]
        const updatedStickers = stickers.map((s) => (s.id === randomSticker.id ? { ...s, unlocked: true } : s))

        setStickers(updatedStickers)
        try {
            localStorage.setItem("pawsome-stickers", JSON.stringify(updatedStickers))
        } catch (err) {
            console.error("Error saving stickers:", err)
        }

        playSound("unlock")

        // Show celebration
        setTimeout(() => {
            setShowStickerGallery(true)
        }, 1000)
    }

    const resetStreak = () => {
        setStreak(0)
        localStorage.setItem(
            "pawsome-stats",
            JSON.stringify({
                streak: 0,
                totalCompleted,
            }),
        )
    }

    const unlockedCount = stickers.filter((s) => s.unlocked).length
    const completedToday = tasks.filter((t) => t.completed).length

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
                <FloatingPaws />
                <div className="text-center z-10">
                    <div className="animate-spin text-6xl mb-4">🐾</div>
                    <p className="text-purple-600 font-medium">Loading your paw-some tasks...</p>
                    <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 relative overflow-hidden">
            <FloatingPaws />
            {showParticles && <PawParticles />}

            <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
                {/* Header */}
                <header className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-4xl animate-bounce">🐾</span>
                        <h1 className="text-4xl font-bold text-purple-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Paw-some Task Board
                        </h1>
                        <span className="text-4xl animate-bounce" style={{ animationDelay: "0.5s" }}>
              🐾
            </span>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex justify-center gap-6 mb-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-purple-200">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-semibold text-purple-700">Streak: {streak}</span>
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-purple-200">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">🏆</span>
                                <span className="text-sm font-semibold text-purple-700">Total: {totalCompleted}</span>
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-purple-200">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">📅</span>
                                <span className="text-sm font-semibold text-purple-700">Today: {completedToday}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-purple-600 mb-6">Complete tasks to unlock adorable animal stickers!</p>

                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={() => setShowStickerGallery(true)}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <Gift className="w-5 h-5 mr-2" />
                            Sticker Gallery ({unlockedCount}/5)
                            <Sparkles className="w-4 h-4 ml-2" />
                        </Button>

                        <Button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            variant="outline"
                            className="rounded-full px-4 py-3 border-purple-300 hover:bg-purple-100 transition-all duration-200"
                        >
                            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        </Button>
                    </div>
                </header>

                {/* Motivational Message */}
                {showMotivation && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full shadow-2xl text-xl font-bold">
                            {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center animate-shake">
                        {error}
                        <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-bold">
                            ×
                        </button>
                    </div>
                )}

                {/* Main Content */}
                <div className="space-y-8">
                    <TaskForm onAddTask={addTask} />
                    <TaskList tasks={tasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} onReorderTasks={reorderTasks} />
                </div>

                {/* Achievement Badges */}
                {totalCompleted > 0 && (
                    <div className="mt-8 text-center">
                        <h3 className="text-lg font-semibold text-purple-800 mb-4">🏆 Achievements</h3>
                        <div className="flex justify-center gap-4 flex-wrap">
                            {totalCompleted >= 1 && (
                                <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse">
                                    🌟 First Task!
                                </div>
                            )}
                            {totalCompleted >= 5 && (
                                <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse">
                                    🚀 Task Master!
                                </div>
                            )}
                            {streak >= 3 && (
                                <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse">
                                    🔥 On Fire!
                                </div>
                            )}
                            {unlockedCount === 5 && (
                                <div className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse">
                                    👑 Sticker King!
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="text-center mt-12 text-purple-500 text-sm">
                    Made with 🐾 by Paw-some Developer
                    {streak > 0 && (
                        <button onClick={resetStreak} className="ml-4 text-xs text-purple-400 hover:text-purple-600 underline">
                            Reset Streak
                        </button>
                    )}
                </footer>

                {/* Sticker Gallery Modal */}
                {showStickerGallery && <StickerGallery stickers={stickers} onClose={() => setShowStickerGallery(false)} />}
            </div>
        </div>
    )
}
