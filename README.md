# Local Development Setup

## Overview

This project is a proof-of-concept integration of **Next.js (App Router)** with **Supabase** as a standalone backend. All backend logic is implemented using **Supabase Edge Functions**, while the frontend handles rendering, authentication, and server actions. The goal is to demonstrate a clean separation between frontend and backend responsibilities using modern tooling.

### What Users Can Do

The application showcases a minimal but complete flow:

- Sign up with credentials (email verification required)
- Sign in / sign out
- View characters fetched from a remote API
- Add characters to favorites (with RLS policies applied)
- Remove characters from favorites

---

## Tech Stack

- Next.js (App Router, Server Actions)
- Supabase (Auth, Edge Functions, postgresql)
- Hono
- Deno
- TypeScript
- Zod
- Tailwind CSS
- PNPM
- Biome

---

## Prerequisites

Required tools:

- Node.js (LTS recommended)
- PNPM
- Supabase CLI
- Deno

---

## 1. Start Local Supabase Environment

Follow Supabase’s official local development guide:  
https://supabase.com/docs/guides/local-development

---

## 2. Environment Variables

Copy the example env file:

```sh
cp frontend/.env.example frontend/.env
```

No Supabase-specific env variables are required for local development.

---

## 3. Apply Database Migrations

Apply SQL migrations:

```sh
npx supabase migration up
```

Skip this if your Supabase setup auto-applies migrations.

---

## 4. Run Edge Functions Locally

From inside the `supabase` directory:

```sh
cd supabase
deno task serve:local
```

This serves all functions under `./supabase/functions`.

---

## 5. Install Dependencies & Run Frontend

From the `frontend` directory:

```sh
cd frontend
pnpm install
pnpm dev
```

## Production Deployment

The production version of the application is available at:  
**https://ra-m-project.vercel.app/**
