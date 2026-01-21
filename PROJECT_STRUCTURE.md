# E-Commerce AI Virtual Try-On - Project Structure

This document provides a detailed overview of the project structure, technologies, and key files. The project is an E-Commerce application with Virtual Try-On capabilities, built using Next.js 16, Supabase, and Tailwind CSS.

## 🏗 Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Shadcn UI
*   **Database & Auth:** Supabase
*   **Storage:** Supabase Storage
*   **Payments:** Razorpay (Integrated via API routes)

## 📂 Folder Structure

### 1. `/app` (Core Application Logic)
The `app` directory follows the Next.js App Router conventions.

*   **`page.tsx`**: The main landing page of the application.
*   **`layout.tsx`**: Root layout wrapping the entire app (includes AuthProvider, ThemeProviders, etc.).
*   **`globals.css`**: Global CSS styles and Tailwind directives.
*   **`/auth`**:
    *   `/auth/callback`: Handles Supabase OAuth/Auth redirects.
*   **`/login`**: Login/Signup page (`page.tsx`).
*   **`/account`**: User dashboard for viewing profile and credits (`page.tsx`).
*   **`/gallery`**: Displays user's generated try-on history (`page.tsx`).
*   **`/product`**: Main product page where users perform Virtual Try-On (`page.tsx`).
*   **`/subscription`**: Pricing and subscription plans page (`page.tsx`).
*   **`/debug`**: Utility page for testing and debugging components (`page.tsx`).
*   **`/api`**: Backend API Routes.
    *   `/api/create-order`: Razorpay order creation.
    *   `/api/verify-payment`: Verifies Razorpay payment signatures.
    *   `/api/generate`: Endpoint for Virtual Try-On generation (Currently simplified/placeholder).

### 2. `/components` (UI Components)
Contains all reusable React components.

*   **Core UI**:
    *   `CardNav.tsx`: Main navigation bar.
    *   `ProfileCard.tsx`: User profile display component.
    *   `auth-provider.tsx`: Context provider for Supabase authentication state.
    *   `logout-button.tsx`: Handles user sign-out.
*   **Visual Effects**:
    *   `Aurora.tsx`: Background aurora effect.
    *   `LiquidEther.tsx`: Fluid background effect.
    *   `MagicBento.tsx`: Bento grid layout component.
    *   `SplashCursor.tsx`: Interactive cursor effect.
    *   `TextMorph.tsx`: Text animation component.
    *   `GridPattern.tsx`: Background grid pattern.
    *   `FadeIn.tsx`: Animation wrapper for fading in elements.
*   **`/ui`**: Shadcn UI generic components (Buttons, Inputs, Dialogs, etc.).

### 3. `/lib` (Utilities & Configuration)
Helper functions and client configurations.

*   **`supabase.ts`**: Client-side Supabase client configuration.
*   **`supabase-server.ts`**: Server-side Supabase client helper (for API routes/Server Components).
*   **`supabase-admin.ts`**: Admin Supabase client (Bypasses RLS - Use with caution).
*   **`storage.ts`**: Helper functions for uploading/retrieving images from Supabase Storage.
*   **`utils.ts`**: General utility functions (e.g., class name merging).
*   **`liquid-ether.ts`**: WebGL/Shader logic for the Liquid Ether effect.

## 🔑 Key Features & Status

*   **Authentication**: Fully functional via Supabase (Email/Password & Social support ready).
*   **Database**: Users, Generations, and Credits tables are set up in Supabase.
*   **Storage**: Image upload and retrieval flow is implemented in `storage.ts`.
*   **UI/UX**: Premium animated UI using framer-motion and custom WebGL effects.
*   **Payments**: Razorpay integration backend is ready (`api/create-order`, `api/verify-payment`).
*   **AI Generation**:
    *   UI for uploading/selecting images is ready (`/product`).
    *   Backend logic in `api/generate` is currently a placeholder (returning 503) awaiting your preferred AI model implementation.

## 🛠 Next Steps (Recommended)
1.  **AI Integration**: Re-implement the AI model logic in `app/api/generate/route.ts` when ready.
2.  **Environment Variables**: Ensure `.env.local` has all Supabase and Razorpay keys.
