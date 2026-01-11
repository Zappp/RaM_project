# RaM-app

Rick & Morty app with React, Supabase, and GraphQL.

## Setup

1. **Install dependencies:**
   ```bash
   npm run setup:api
   npm run setup:frontend
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials and API URLs.

3. **Generate GraphQL types:**
   ```bash
   npm run codegen
   ```

## Run

```bash
# From root directory

# API (Supabase Edge Function) - only needed for local development
npm run api
# Runs on http://localhost:54321/functions/v1/graphql

# Frontend (Next.js)
npm run frontend
# Runs on http://localhost:3000
```

**Note:** To run the API locally, you need to setup local Supabase and configure appropriate API vars in `.env`. If using a remote API, the API doesn't need to be run locally.

## Technical Decisions

**Monorepo:** Separate `api/` (Deno) and `frontend/` (Next.js) for clear boundaries.

**API:** Supabase Edge Functions with Deno. Using Hono + GraphQL Yoga for the GraphQL server.

**Cookie-based auth:** HttpOnly cookies for JWT storage. API validates JWT from cookies, frontend sends via Authorization header. JWT validation cached (60s TTL) to reduce Supabase calls.

**GraphQL:** Single endpoint with typed operations. Codegen generates TypeScript types from schema. Server-side requests use typed document nodes for type safety.

**Supabase:** Auth + Postgres with RLS. Service role key for admin operations (favorites), anon key for client auth.

**JWT verification:** Currently disabled (`verify_jwt = false` in `api/supabase/config.toml`) for both local and remote. Attempted to enable with approach from [supabase/supabase#17164](https://github.com/supabase/supabase/issues/17164#issuecomment-2683354018) but encountered JWS signature validation errors. Likely issue with JWT verification flow implementation.

## Possible Improvements

**Testing:** Add Vitest setup for frontend, complete test coverage for auth/components, E2E tests with Playwright.

**JWT:** Fix JWT verification flow.

**Architecture:** Move entire auth logic to API - frontend should not make any Supabase calls, all auth operations via GraphQL.

**Observability:** Logger setup, error tracking middleware, optional Sentry or KV integration for caching backend side.

**Documentation:** API docs with Magidoc.

**DevOps:** Deployment automation GitHub Supabase integration.
