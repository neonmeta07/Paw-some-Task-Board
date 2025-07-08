import { type NextRequest, NextResponse } from "next/server"
import { tasks } from "../store"

export async function PUT(request: NextRequest) {
    try {
        const { tasks: reorderedTasks } = await request.json()

        if (!Array.isArray(reorderedTasks)) {
            return NextResponse.json({ error: "Tasks must be an array" }, { status: 400 })
        }

        console.log(`Reordering ${reorderedTasks.length} tasks`)

        // Update the global tasks array
        tasks.length = 0 // clear
        tasks.push(...reorderedTasks) // replace with reordered list

        console.log(`Tasks reordered successfully`)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error reordering tasks:", error)
        return NextResponse.json({ error: "Failed to reorder tasks" }, { status: 500 })
    }
}
