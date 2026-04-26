# Game On!

Live sports scoreboard, schedules, and where-to-watch hub. Built with Next.js 16, Tailwind 4, Supabase (auth + favorites), and Claude (chat with web search). ESPN's public scoreboard API powers the data.

Sports-bar / LED-dot-matrix aesthetic. Tracks MLB, NFL, NBA, NHL, EPL, UCL, and MLS.

**Live at:** https://gameon.donofr.io (with `game-on-three.vercel.app` as the original Vercel URL).

## Local development

```bash
bun install
cp .env.local.example .env.local   # then fill in values
bun run dev
```

App runs on `http://localhost:3000` (or `--port 3010` if started via the workspace launcher).

### Environment variables

See `.env.local.example`. You need:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — magic-link auth and per-user favorites. Without these, the app still runs but `/teams` shows no favorites and starring teams returns 503.
- `ANTHROPIC_API_KEY` — Claude chat panel. Without it the chat slide-over returns 503.

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Project Settings → API: copy the URL and `anon` key into `.env.local`.
3. Authentication → Providers: ensure Email is enabled (default).
4. SQL Editor: paste and run [`supabase/schema.sql`](./supabase/schema.sql). Creates the `favorite_teams` table and RLS policies.
5. Authentication → URL Configuration: add `http://localhost:3000/auth/callback` (and your production URL) to redirect URLs.

## Routes

| Path | What it is |
|---|---|
| `/today` | Live, upcoming, and finished games across all leagues today |
| `/scores` | All games, filterable by league |
| `/schedule` | 7-day grid; pick a date |
| `/teams` | Your starred teams' next games. Requires sign-in. |
| `/login` | Magic-link email sign-in |

The "Ask Claude" button (sidebar on desktop, floating button on mobile) opens a slide-over with streaming Claude chat and the day's games as context. Claude has the web-search tool for live questions about blackouts, channels, etc.

## Architecture notes

- **Data**: ESPN's public scoreboard endpoints (free, no key). `src/lib/espn.ts`. Revalidated every 30s.
- **Auth**: Supabase magic link via `@supabase/ssr`. The Next.js 16 auth gate lives in `src/proxy.ts` (formerly `middleware.ts`).
- **Favorites**: `favorite_teams` table with row-level security. `src/app/api/favorites/`.
- **Chat**: `src/app/api/chat/route.ts` streams Server-Sent Events from `messages.stream()` with the `web_search_20260209` tool. The `chat-panel.tsx` client parses the SSE.
- **Theme**: LED dot-matrix aesthetic in `src/app/globals.css` — amber on near-black, Silkscreen for display type, Inter for body.

## Deploying

Push to GitHub, then import in Vercel. Set the same three env vars in the Vercel project settings, redeploy. Add the production URL to Supabase's redirect allow-list.
