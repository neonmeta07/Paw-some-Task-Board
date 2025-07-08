import type React from "react"
import type { Metadata } from "next"
import "./global.css"
import { Quicksand } from "next/font/google"

const quicksand = Quicksand({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
})

export const metadata: Metadata = {
    title: "Paw-some Task Board",
    description: "A cute, gamified to-do list where completing tasks unlocks adorable animal stickers!",
    keywords: "todo, task management, gamification, cute, animals, productivity",
    authors: [{ name: "Paw-some Developer" }],
    viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={quicksand.className}>
        <head></head>
        <body className="antialiased">{children}</body>
        </html>
    )
}
