# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Products — a management web app built with Next.js 16 (App Router), consumindo a Products API. O backend expõe um spec OpenAPI em `/swagger.json` e autentica via BetterAuth com Google OAuth.

## Commands

```bash
pnpm dev          # Start dev server (do NOT run this to verify changes)
pnpm build        # Production build
pnpm lint         # Run ESLint
npx orval         # Regenerate API client from backend OpenAPI spec (fetch + rc targets)
npx shadcn@latest add <component>  # Install a shadcn/ui component
```

## Architecture

### Path Aliases

`@/*` maps to the project root (`./`). Example: `@/components/ui/button`, `@/app/_lib/auth-client`.

### App Structure

- `app/` — Next.js App Router pages and app-level code
  - `app/_lib/` — Internal libraries (auth client, API layer, fetch mutators, providers)
  - `app/_lib/api/fetch-generated/` — Orval-generated fetch functions for Server Components
  - `app/_lib/api/rc-generated/` — Orval-generated TanStack Query hooks for Client Components
  - `app/_lib/auth-client.ts` — BetterAuth client instance (`authClient`)
  - `app/_lib/fetch.ts` — Custom fetch mutator for Server Components (uses `next/headers` to forward cookies)
  - `app/_lib/fetch-client.ts` — Custom fetch mutator for Client Components (cookie vai automático via `credentials: "include"`)
  - `app/_lib/providers.tsx` — `QueryClientProvider` (TanStack Query), montado em `app/layout.tsx`
- `components/ui/` — shadcn/ui components (new-york style, lucide icons)
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

### API Layer (Orval)

Dois targets no `orval.config.ts`, ambos ativos:

1. **`fetch`** — Gera funções fetch simples em `app/_lib/api/fetch-generated/index.ts`. Usado em Server Components (depende de `next/headers` pra encaminhar cookies).
2. **`rc`** — Gera hooks do TanStack Query em `app/_lib/api/rc-generated/index.ts`. Usado em Client Components (o mutator `fetch-client.ts` não depende de `next/headers`; o cookie de sessão vai automático via `credentials: "include"`).

A URL base da API vem de `NEXT_PUBLIC_API_URL` (ver `.env.example`).

### Authentication

- Uses BetterAuth client from `app/_lib/auth-client.ts`
- No middleware — auth checks happen directly in each page
- Server Components: `authClient.getSession({ fetchOptions: { headers: await headers() } })`
- Client Components: `authClient.useSession()` hook
- Protected pages redirect to `/auth`; `/auth` redirects to `/` if already logged in

### Styling

- Tailwind CSS v4 with oklch color variables defined in `app/globals.css`
- Always use theme CSS variables (e.g., `bg-primary`, `text-muted-foreground`), never hardcoded Tailwind colors
- Fonts: Geist Sans (`--font-geist-sans`), Geist Mono (`--font-geist-mono`), Inter Tight (`--font-inter-tight` / `--font-heading`)

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8080   # Backend API URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Frontend URL
```

## Key Conventions

- Package manager: **pnpm**
- Date library: **dayjs** (never use native Date formatting)
- No comments in code
- kebab-case for file and folder names
- Never run `pnpm run dev` to verify changes
- Never use middleware for auth
- Use `Image` from `next/image` for all images
