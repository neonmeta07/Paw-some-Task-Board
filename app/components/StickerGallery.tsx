"use client"

import { Button } from "./ui/button"
import { X, Share2 } from "lucide-react"
import StickerItem from "./StickerItem"

interface Sticker {
    id: string
    name: string
    unlocked: boolean
    animation: string
}

interface StickerGalleryProps {
    stickers: Sticker[]
    onClose: () => void
}

export default function StickerGallery({ stickers, onClose }: StickerGalleryProps) {
    const unlockedCount = stickers.filter((s) => s.unlocked).length

    const shareProgress = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "My Paw-some Progress!",
                    text: `I've unlocked ${unlockedCount}/5 stickers on my Paw-some Task Board! 🐾`,
                    url: window.location.href,
                })
            } catch (err) {
                console.log("Error sharing:", err)
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(
                `I've unlocked ${unlockedCount}/5 stickers on my Paw-some Task Board! 🐾 ${window.location.href}`,
            )
            alert("Progress copied to clipboard!")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl transform animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                            <span className="animate-bounce">🎁</span>
                            Sticker Gallery
                            <span className="animate-bounce" style={{ animationDelay: "0.5s" }}>
                ✨
              </span>
                        </h2>
                        <p className="text-purple-600">{unlockedCount}/5 stickers unlocked</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={shareProgress} variant="outline" size="sm" className="rounded-full bg-transparent">
                            <Share2 className="w-4 h-4" />
                        </Button>
                        <Button onClick={onClose} variant="ghost" size="sm" className="rounded-full" aria-label="Close gallery">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="bg-purple-200 rounded-full h-4 overflow-hidden relative">
                        <div
                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${(unlockedCount / 5) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-800">
                            {Math.round((unlockedCount / 5) * 100)}%
                        </div>
                    </div>
                    <p className="text-sm text-purple-600 mt-2 text-center">Complete more tasks to unlock all stickers!</p>
                </div>

                {/* Stickers Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {stickers.map((sticker, index) => (
                        <div
                            key={sticker.id}
                            className="transform transition-all duration-300 hover:scale-105"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <StickerItem sticker={sticker} />
                        </div>
                    ))}
                </div>

                {/* Encouragement Message */}
                {unlockedCount === 5 ? (
                    <div className="text-center p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl border-2 border-purple-300 animate-pulse">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold text-purple-800 mb-2">Congratulations!</h3>
                        <p className="text-purple-600 text-lg">You've unlocked all the stickers!</p>
                        <p className="text-purple-500 text-sm mt-2">You're a true Paw-some Task Master! 👑</p>
                    </div>
                ) : (
                    <div className="text-center p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl border border-purple-200">
                        <div className="text-4xl mb-4">🌟</div>
                        <p className="text-purple-600 text-lg font-medium">
                            Complete {5 - unlockedCount} more task{5 - unlockedCount !== 1 ? "s" : ""} to unlock more adorable
                            stickers!
                        </p>
                        <p className="text-purple-500 text-sm mt-2">Keep up the amazing work! 💪</p>
                    </div>
                )}
            </div>
        </div>
    )
}
