import { type NextRequest, NextResponse } from "next/server"
import { tasks, findTaskIndexById } from "../store"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        if (!id) {
            return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
        }

        const updates = await request.json()
        console.log(`Updating task ${id} with:`, updates)
        console.log(
            `Current tasks:`,
            tasks.map((t) => ({ id: t.id, description: t.description })),
        )

        const taskIndex = findTaskIndexById(id)

        if (taskIndex === -1) {
            console.log(
                `Task with ID ${id} not found. Available tasks:`,
                tasks.map((t) => t.id),
            )
            return NextResponse.json({ error: "Task not found" }, { status: 404 })
        }

        // Validate updates
        if (updates.description !== undefined) {
            if (typeof updates.description !== "string" || updates.description.trim().length === 0) {
                return NextResponse.json({ error: "Description must be a non-empty string" }, { status: 400 })
            }
            if (updates.description.length > 100) {
                return NextResponse.json({ error: "Description must be 100 characters or less" }, { status: 400 })
            }
        }

        // Update the task
        const originalTask = tasks[taskIndex]
        tasks[taskIndex] = { ...originalTask, ...updates }

        console.log(`Task updated successfully:`, tasks[taskIndex])
        return NextResponse.json(tasks[taskIndex])
    } catch (error) {
        console.error("Error updating task:", error)
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        if (!id) {
            return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
        }

        const taskIndex = findTaskIndexById(id)

        if (taskIndex === -1) {
            console.log(
                `Task with ID ${id} not found for deletion. Available tasks:`,
                tasks.map((t) => t.id),
            )
            return NextResponse.json({ error: "Task not found" }, { status: 404 })
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0]
        console.log(`Task deleted successfully:`, deletedTask)

        return NextResponse.json({ success: true, deletedTask })
    } catch (error) {
        console.error("Error deleting task:", error)
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
    }
}
