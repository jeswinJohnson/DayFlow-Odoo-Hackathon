# DayFlow - Development & Design Style Guide

This document outlines the project architecture, design system, and development procedures for the DayFlow codebase. Follow these conventions to maintain consistency across the team.

---

## 1. Directory & Architecture Overview

```
frontend/
├── app/                      # Next.js App Router (Pages, Layouts, Global Rules)
│   ├── globals.css           # Global Tailwind CSS directives & theme styles
│   ├── layout.tsx            # Root layout (wraps AppProvider)
│   ├── not-found.tsx         # Global custom 404 page
│   ├── page.tsx              # Home / Dashboard entry page
│   └── providers.tsx         # Client provider wrapper
├── components/               # Reusable UI components
│   ├── Card.tsx              # Example UI Card component
│   └── index.ts              # Central re-export for clean imports
├── context/                  # State & API Context Layer
│   └── AppContext.tsx        # Central context holding API logic & state
└── types/                    # Shared TypeScript Definitions
    └── index.ts              # Interfaces, payload types, and data models
```

---

## 2. Core Development Procedure

### Architecture Rule: Context-First Data Flow
All backend interactions, API integrations, data processing, and global state live in **`context/AppContext.tsx`**. Pages and components should **never** make ad-hoc API requests directly inside component files. Instead, they consume context methods using the **`useApp()`** hook.

### Step-by-Step Feature Workflow

When adding a new feature or API endpoint (e.g. `getDashboardData`):

1. **Define Types** (`types/index.ts`)
   - Add custom interfaces and response schemas:
     ```typescript
     export interface DashboardData {
       userCount: number;
       activeSessions: number;
     }
     ```
   - Update `AppContextType` to include the new function signature.

2. **Implement API & Processing Method** (`context/AppContext.tsx`)
   - Implement the function inside `AppProvider`:
     ```typescript
     const getDashboard = async (): Promise<ApiResponse<DashboardData>> => {
       setIsLoading(true);
       try {
         // API fetching logic here...
       } finally {
         setIsLoading(false);
       }
     };
     ```
   - Expose the method through the `AppContext.Provider` value.

3. **Build Reusable UI Components** (`components/`)
   - Place generic/reusable UI elements (cards, buttons, modally, badges) inside `components/`.
   - Export them in `components/index.ts`.

4. **Assemble Page** (`app/`)
   - Import `useApp()` hook and components:
     ```typescript
     import { useApp } from "@/context/AppContext";
     import { Card } from "@/components";
     ```

---

## 3. Design & Styling System

The application uses **Tailwind CSS** with a modern, high-contrast **Dark Mode** aesthetic.

### Palette & Color Tokens
- **Background Base**: `bg-zinc-950` (Deep obsidian dark background)
- **Container Surfaces**: `bg-zinc-900/60` with `border border-zinc-800`
- **Primary Brand Accent**: Indigo (`indigo-600` for primary buttons, `indigo-500` hover, `indigo-400` text highlights)
- **Text Scale**: Primary `text-white`, Secondary `text-zinc-400`, Subtle `text-zinc-500`
- **Feedback Colors**: Success `emerald-400`, Error `rose-400` / `rose-950/50`

### Visual Depth & Glassmorphism
- Use semi-transparent background fills with backdrop blurs for modern glass elevation:
  ```tsx
  <div className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-2xl shadow-xl">
  ```
- Use rounded corner scales (`rounded-xl` or `rounded-2xl`) across cards, modals, and buttons.

### Micro-Animations & Interactivity
- Interactive buttons should include active scale compression (`active:scale-95`) and smooth color transitions (`transition-all duration-200`).
- Display visible spinner indicators during loading states (`isLoading`).

---

## 4. TypeScript Guidelines

- **Strict Type Checking**: Avoid using `any`. Define strong interfaces in `types/index.ts`.
- **Standardized API Response Wrappers**:
  ```typescript
  export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
  }
  ```
- **Component Props**: Define explicit prop interfaces for every UI component.

---

## 5. Verification Commands

Before committing code, verify compilation and type checks:

```bash
# Run development server
npm run dev

# Run production build & TypeScript check
npm run build
```
