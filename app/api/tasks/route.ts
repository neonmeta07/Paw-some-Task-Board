import { type NextRequest, NextResponse } from "next/server"
import { tasks, getNextId, type Task } from "./store"

export async function GET() {
    try {
        console.log(`GET /api/tasks - returning ${tasks.length} tasks`)
        return NextResponse.json(tasks.sort((a, b) => a.order - b.order))
    } catch (error) {
        console.error("Error fetching tasks:", error)
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const { description } = await request.json()

        if (!description || description.trim().length === 0) {
            return NextResponse.json({ error: "Description is required" }, { status: 400 })
        }

        if (description.length > 100) {
            return NextResponse.json({ error: "Description must be 100 characters or less" }, { status: 400 })
        }

        const newTask: Task = {
            id: getNextId(),
            description: description.trim(),
            completed: false,
            order: tasks.length,
            createdAt: new Date().toISOString(),
        }

        tasks.push(newTask)
        console.log(`Task created successfully:`, newTask)

        return NextResponse.json(newTask, { status: 201 })
    } catch (error) {
        console.error("Error creating task:", error)
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
    }
}
