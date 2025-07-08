"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Plus, Sparkles } from "lucide-react"

interface TaskFormProps {
    onAddTask: (description: string) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSparkle, setShowSparkle] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!description.trim()) {
            alert("Please enter a task description!")
            return
        }

        if (description.length > 100) {
            alert("Task description must be 100 characters or less!")
            return
        }

        setIsSubmitting(true)
        setShowSparkle(true)

        await onAddTask(description.trim())
        setDescription("")
        setIsSubmitting(false)

        setTimeout(() => setShowSparkle(false), 1000)
    }

    const placeholders = [
        "What paw-some task would you like to add? 🐾",
        "Ready to earn some stickers? Add a task! ✨",
        "What's on your mind today? 🌟",
        "Time to be productive! What's next? 🚀",
        "Add a task and make progress! 💪",
    ]

    const [currentPlaceholder] = useState(placeholders[Math.floor(Math.random() * placeholders.length)])

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200 relative overflow-hidden">
            {showSparkle && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-200/50 to-purple-200/50 animate-pulse"></div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-3 relative z-10">
                <div className="flex-1">
                    <Input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={currentPlaceholder}
                        maxLength={100}
                        className="rounded-full border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800 placeholder:text-purple-400 transition-all duration-200 focus:scale-105"
                        disabled={isSubmitting}
                    />
                    <div className="text-right text-xs text-purple-500 mt-1 flex justify-between">
                        <span className="text-purple-400">💡 Tip: Be specific for better results!</span>
                        <span>{description.length}/100</span>
                    </div>
                </div>
                <Button
                    type="submit"
                    disabled={isSubmitting || !description.trim()}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 transform hover:scale-105"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin w-5 h-5 mr-2">⭐</div>
                            Adding...
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5 mr-2" />
                            Add Task
                            <Sparkles className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    )
}
