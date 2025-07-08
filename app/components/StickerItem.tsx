"use client"

interface Sticker {
    id: string
    name: string
    unlocked: boolean
    animation: string
}

interface StickerItemProps {
    sticker: Sticker
}

// Animated Sticker Components
const BouncyBunny = ({ unlocked }: { unlocked: boolean }) => (
    <div className={`text-6xl ${unlocked ? "animate-bounce" : "grayscale opacity-50"}`}>🐰</div>
)

const HappyPuppy = ({ unlocked }: { unlocked: boolean }) => (
    <div className={`text-6xl ${unlocked ? "animate-pulse" : "grayscale opacity-50"}`}>🐶</div>
)

const SleepyKitten = ({ unlocked }: { unlocked: boolean }) => (
    <div className={`text-6xl ${unlocked ? "animate-pulse" : "grayscale opacity-50"}`}>😸</div>
)

const DancingPanda = ({ unlocked }: { unlocked: boolean }) => (
    <div
        className={`text-6xl ${unlocked ? "animate-spin" : "grayscale opacity-50"}`}
        style={{
            animation: unlocked ? "wiggle 1s ease-in-out infinite" : undefined,
        }}
    >
        🐼
    </div>
)

const JumpingFox = ({ unlocked }: { unlocked: boolean }) => (
    <div
        className={`text-6xl ${unlocked ? "animate-bounce" : "grayscale opacity-50"}`}
        style={{
            animationDelay: unlocked ? "0.5s" : undefined,
        }}
    >
        🦊
    </div>
)

export default function StickerItem({ sticker }: StickerItemProps) {
    const getStickerComponent = () => {
        switch (sticker.id) {
            case "1":
                return <BouncyBunny unlocked={sticker.unlocked} />
            case "2":
                return <HappyPuppy unlocked={sticker.unlocked} />
            case "3":
                return <SleepyKitten unlocked={sticker.unlocked} />
            case "4":
                return <DancingPanda unlocked={sticker.unlocked} />
            case "5":
                return <JumpingFox unlocked={sticker.unlocked} />
            default:
                return <div className="text-6xl">❓</div>
        }
    }

    return (
        <div
            className={`bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 text-center border-2 transition-all duration-200 ${
                sticker.unlocked ? "border-purple-300 shadow-lg hover:shadow-xl" : "border-gray-200 shadow-sm"
            }`}
        >
            <div className="mb-3">{getStickerComponent()}</div>
            <h3 className={`font-semibold text-sm ${sticker.unlocked ? "text-purple-800" : "text-gray-500"}`}>
                {sticker.name}
            </h3>
            {!sticker.unlocked && <p className="text-xs text-gray-400 mt-1">🔒 Locked</p>}
        </div>
    )
}
