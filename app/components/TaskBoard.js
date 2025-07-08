"use client";
import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import StickerGallery from "./StickerGallery";
import { STICKERS } from "../lib/stickers";

function getRandomSticker(unlocked) {
    const locked = STICKERS.map((_, i) => i).filter((i) => !unlocked[i]);
    if (locked.length === 0) return null;
    return locked[Math.floor(Math.random() * locked.length)];
}

export default function TaskBoard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [stickers, setStickers] = useState(() => JSON.parse(localStorage.getItem("stickers") || "[]"));

    // Dummy tasks for demo
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setTasks([
                { id: "1", description: "Buy treats", completed: false },
                { id: "2", description: "Walk the dog", completed: false },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        localStorage.setItem("stickers", JSON.stringify(stickers));
    }, [stickers]);

    const addTask = (desc) => {
        setTasks([...tasks, { id: Date.now().toString(), description: desc, completed: false }]);
    };

    const completeTask = (id, completed) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));
        if (completed) {
            const unlocked = stickers.slice();
            if (unlocked.length < 10) {
                const next = getRandomSticker(unlocked);
                if (next !== null) unlocked[next] = true;
                setStickers(unlocked);
            }
        }
    };

    const editTask = (id, desc) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, description: desc } : t));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const reorderTasks = (from, to) => {
        const items = Array.from(tasks);
        const [moved] = items.splice(from, 1);
        items.splice(to, 0, moved);
        setTasks(items);
    };

    const incomplete = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);

    return (
        <section>
            <TaskForm onAdd={addTask} />
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <svg className="animate-spin" width="48" height="48" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="#FFD1DC" />
                    </svg>
                </div>
            ) : (
                <>
                    <TaskList
                        tasks={incomplete}
                        onComplete={completeTask}
                        onEdit={editTask}
                        onDelete={deleteTask}
                        onReorder={reorderTasks}
                    />
                    <h3 className="text-lg font-bold text-pawBlue mb-2">Completed</h3>
                    <ul>
                        {completed.map((task) => (
                            <li key={task.id} className="flex items-center gap-2 text-gray-400 line-through mb-1">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="8" fill="#B2EBF2" />
                                </svg>
                                {task.description}
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {galleryOpen && (
                <StickerGallery unlocked={stickers} onClose={() => setGalleryOpen(false)} />
            )}
        </section>
    );
}

export function StickerButton() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-pawPink px-3 py-1 rounded-lg font-bold shadow hover:bg-pawBlue transition"
                aria-label="Open sticker gallery"
            >
                🏆 Stickers
            </button>
            {open && (
                <StickerGallery
                    unlocked={JSON.parse(localStorage.getItem("stickers") || "[]")}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}