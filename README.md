# Paw-some Task Board

A cute, gamified to-do list built with Next.js 14, Firebase, Tailwind CSS, and react-beautiful-dnd.

## Features

- Add, edit, delete, and reorder tasks (drag-and-drop)
- Complete tasks to unlock animated animal stickers
- Sticker gallery with up to 10 unlocks
- Responsive, accessible, and animal-themed design

## Setup

1. Clone the repo and install dependencies:
   ```
   npm install
   ```

2. Create a Firebase project and Firestore database.  
   Add your Firebase config to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. Run the app:
   ```
   npm run dev
   ```

4. Deploy to Vercel for production.

## Credits

- Paw print and animal SVGs: [unDraw](https://undraw.co/), [SVGRepo](https://www.svgrepo.com/)
- Font: [Quicksand](https://fonts.google.com/specimen/Quicksand)