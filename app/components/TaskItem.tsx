"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Edit2, Trash2, Save, X, GripVertical } from 'lucide-react'

interface Task {
    id: string
    description: string
    completed: boolean
    order: number
    createdAt?: string
}

interface Task {
    id: string
    description: string
    completed: boolean
    order: number
    createdAt?: string
}

interface TaskItemProps {
    task: Task
    onUpdate: (id: string, updates: Partial<Task>) => void
    onDelete: (id: string) => void
    isDragging?: boolean
}

// Paw print SVG components
const CatPaw = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM8 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM16 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" />
    </svg>
)

const DogPaw = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM14 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM18 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM12 10c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z" />
    </svg>
)

export default function TaskItem({ task, onUpdate, onDelete, isDragging }: TaskItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(task.description)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleSave = async () => {
        if (editValue.trim() && editValue.length <= 100) {
            setIsUpdating(true)
            await onUpdate(task.id, { description: editValue.trim() })
            setIsEditing(false)
            setIsUpdating(false)
        }
    }

    const handleCancel = () => {
        setEditValue(task.description)
        setIsEditing(false)
    }

    const handleComplete = async (checked: boolean) => {
        console.log(`[UI] Attempting to ${checked ? "complete" : "uncomplete"} task:`, task.id)
        setIsUpdating(true)
        await onUpdate(task.id, { completed: checked })
        setIsUpdating(false)
    }

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this task?")) {
            await onDelete(task.id)
        }
    }

    return (
        <div
            className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md border border-purple-200 transition-all duration-200 hover:shadow-lg ${
                isDragging ? "shadow-xl border-purple-400" : ""
            } ${task.completed ? "opacity-75" : ""} ${isUpdating ? "opacity-50" : ""}`}
        >
            <div className="flex items-center gap-3">
                {/* Drag Handle */}
                {!task.completed && !isEditing && (
                    <GripVertical className="w-5 h-5 text-purple-400 cursor-grab active:cursor-grabbing flex-shrink-0" />
                )}

                {/* Paw Print Icon */}
                <div className={`w-8 h-8 flex-shrink-0 ${task.completed ? "text-green-500" : "text-purple-500"}`}>
                    {task.completed ? <DogPaw className="w-full h-full" /> : <CatPaw className="w-full h-full" />}
                </div>

                {/* Checkbox */}
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => handleComplete(e.target.checked)}
                    disabled={isUpdating}
                    className="w-5 h-5 rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer disabled:opacity-50 flex-shrink-0"
                    aria-label={`Mark task "${task.description}" as ${task.completed ? "incomplete" : "complete"}`}
                />

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <div className="flex gap-2 items-center">
                            <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                maxLength={100}
                                className="flex-1 rounded-lg border-purple-300 focus:border-purple-500"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSave()
                                    if (e.key === "Escape") handleCancel()
                                }}
                                autoFocus
                                disabled={isUpdating}
                            />
                            <Button
                                onClick={handleSave}
                                size="sm"
                                disabled={isUpdating || !editValue.trim()}
                                className="bg-green-500 hover:bg-green-600 text-white rounded-lg flex-shrink-0"
                            >
                                <Save className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={handleCancel}
                                size="sm"
                                variant="outline"
                                className="rounded-lg bg-transparent flex-shrink-0"
                                disabled={isUpdating}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <span className={`text-purple-800 break-words ${task.completed ? "line-through text-green-600" : ""}`}>
              {task.description}
            </span>
                    )}
                </div>

                {/* Action Buttons */}
                {!isEditing && (
                    <div className="flex gap-2 flex-shrink-0">
                        <Button
                            onClick={() => setIsEditing(true)}
                            size="sm"
                            variant="ghost"
                            className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg"
                            aria-label="Edit task"
                            disabled={isUpdating}
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                            onClick={handleDelete}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
                            aria-label="Delete task"
                            disabled={isUpdating}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
