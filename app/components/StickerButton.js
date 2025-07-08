"use client";
import { useState } from "react";
import StickerGallery from "./StickerGallery";

export default function StickerButton() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-pawPink px-3 py-1 rounded-lg font-bold"
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