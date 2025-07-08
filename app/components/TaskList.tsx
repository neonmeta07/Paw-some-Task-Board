"use client"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import TaskItem from "./TaskItem"

interface Task {
    id: string
    description: string
    completed: boolean
    order: number
}

interface TaskListProps {
    tasks: Task[]
    onUpdateTask: (id: string, updates: Partial<Task>) => void
    onDeleteTask: (id: string) => void
    onReorderTasks: (tasks: Task[]) => void
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask, onReorderTasks }: TaskListProps) {
    const incompleteTasks = tasks.filter((task) => !task.completed)
    const completedTasks = tasks.filter((task) => task.completed)

    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const items = Array.from(incompleteTasks)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        // Update order numbers
        const reorderedTasks = items.map((task, index) => ({
            ...task,
            order: index,
        }))

        // Combine with completed tasks (they keep their original order)
        const allTasks = [...reorderedTasks, ...completedTasks]
        onReorderTasks(allTasks)
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-semibold text-purple-700 mb-2">No tasks yet!</h3>
                <p className="text-purple-500">Add your first task to start earning stickers!</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Incomplete Tasks */}
            {incompleteTasks.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
                        <span>🐾</span>
                        To-Do Tasks ({incompleteTasks.length})
                    </h2>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="tasks">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                    {incompleteTasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`transition-transform ${snapshot.isDragging ? "rotate-2 scale-105" : ""}`}
                                                >
                                                    <TaskItem
                                                        task={task}
                                                        onUpdate={onUpdateTask}
                                                        onDelete={onDeleteTask}
                                                        isDragging={snapshot.isDragging}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                        <span>✅</span>
                        Completed Tasks ({completedTasks.length})
                    </h2>
                    <div className="space-y-3">
                        {completedTasks.map((task) => (
                            <TaskItem key={task.id} task={task} onUpdate={onUpdateTask} onDelete={onDeleteTask} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
