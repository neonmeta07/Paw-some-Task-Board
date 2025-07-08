// A SINGLE in-memory store that every route imports.
// ➡️ Replace with a database (Firebase / MongoDB) in production.

export interface Task {
    id: string
    description: string
    completed: boolean
    order: number
    createdAt: string
}

// Initialize with a sample task so there's always something to interact with
export const tasks: Task[] = [
    {
        id: "1",
        description: "Get your first sticker free!",
        completed: false,
        order: 0,
        createdAt: new Date().toISOString(),
    },
]

let nextId = 2
export function getNextId(): string {
    return (nextId++).toString()
}

// Helper function to find task by ID
export function findTaskById(id: string): Task | undefined {
    return tasks.find((task) => task.id === id)
}

// Helper function to find task index by ID
export function findTaskIndexById(id: string): number {
    return tasks.findIndex((task) => task.id === id)
}
