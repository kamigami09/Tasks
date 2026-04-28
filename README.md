# Task Follow App

A highly scalable, mobile-responsive productivity and task management app. This project helps users manage their time effectively by seamlessly bridging the gap between high-level **Monthly** goals, actionable **Weekly** targets, and focused **Daily** to-dos.

## 🚀 Features

- **Strict Hierarchical Workflows**: Break down Monthly goals directly into Weekly plans, and Weekly plans into Daily tasks.
- **Smart Orchestration Engine**: Automatically detects overdue tasks and calculates parent-child completion progress mathematically.
- **Persistent Local State**: HeavILY optimized `Zustand` state layer synced to `localStorage`, protecting against infinite re-renders.
- **PWA & Capacitor Ready**: Configured with `vite-plugin-pwa` so it can be installed natively or wrapped easily into an iOS app later.
- **Fully Responsive UI**: Dark mode, light mode, glass-morphism designs, built entirely around mobile-first utility classes with Tailwind CSS.

## 🏗 Architecture

The goal of this architecture is to decouple standard React interactions from Data Persistence so the app can scale easily to Firebase/Supabase in the future.

- **UI Layer** (`components`, `pages`): Purely presentational logic. Dispatches all events and reads all state directly from Zustand.
- **State Layer** (`store/useTaskStore.ts`): Simple UI binding layer. It passes state modifications to the Task Engine to parse before mutating React state.
- **Task Engine Layer** (`engine/taskEngine.ts`): The core orchestrator. Runs deep referential-safe array checks to enforce carry-overs, overdue status, and calculate `%` completion.
- **Business Logic Layer** (`utils/taskLogic.ts`): Pure functions. Zero side-effects.
- **Storage Layer** (`services/storageService.ts`): Pure data interaction. Currently backed by `localStorage` but designed to be replaced with a single Supabase wrapper later.

## 📦 Running Locally

1. Make sure you have NodeJS installed.
2. Clone this repository and navigate into the `Tasks` folder:
   ```bash
   cd Tasks
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

## 🛠 Future Roadmap
- [ ] Implement robust Drag-and-Drop functionality using generic sortable libraries.
- [ ] Add explicit Delete features to standard Tasks.
- [ ] Hook into robust, multi-tenant databases (Firebase / Supabase Auth).
