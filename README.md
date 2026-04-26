# Game On!

Live sports scoreboard, schedules, and where-to-watch hub. Built with Next.js 16, Tailwind 4, and Claude (chat with web search). ESPN's public scoreboard API powers the data.

Sports-bar / LED-dot-matrix aesthetic. Tracks MLB, NFL, NBA, NHL, EPL, UCL, and MLS.

**Live at:** https://gameon.donofr.io (with `game-on-three.vercel.app` as the original Vercel URL).

## Local development

```bash
bun install
cp .env.local.example .env.local   # then fill in ANTHROPIC_API_KEY
bun run dev
```

App runs on `http://localhost:3000` (or `--port 3010` if started via the workspace launcher).

### Environment variables

See `.env.local.example`. You only need:

- `ANTHROPIC_API_KEY` — Claude chat panel. Without it the chat slide-over returns 503.

## Routes

| Path | What it is |
|---|---|
| `/scores` | Today's full slate, league filter pills at top. Default route — `/` redirects here. |
| `/live` | Currently-live games only, league filter at top. |
| `/schedule` | 7-day grid; pick a date. |
| `/teams` | Your starred teams' next games. **Browser-local** — favorites live in localStorage, no sign-in. |

The "Ask Claude" button (sidebar on desktop, floating button on mobile) opens a slide-over with streaming Claude chat. Claude has the day's ESPN games as context plus web-search for live questions about blackouts, channels, etc.

## Architecture notes

- **Data**: ESPN's public scoreboard endpoints (free, no key). `src/lib/espn.ts`. Revalidated every 30s. Defensive date filter trims off-window fallbacks (e.g. ESPN serving the Super Bowl in NFL offseason).
- **Times**: All game times rendered in US Eastern via `Intl.DateTimeFormat` so server (UTC) and client agree.
- **Favorites**: Browser-local via `useFavorites` hook (`src/lib/use-favorites.ts`). Each browser keeps its own list — no auth, no backend, no rate limits. Cross-tab sync via the `storage` event.
- **Chat**: `src/app/api/chat/route.ts` streams Server-Sent Events from `messages.stream()` with the `web_search_20260209` tool. Claude Opus 4.7 with adaptive thinking. The `chat-panel.tsx` client parses the SSE.
- **Theme**: Light cream surface with deep amber "scoreboard ink" headings. Silkscreen for display type, Inter for body. `src/app/globals.css`.
- **Watch links**: `src/lib/watch-links.ts` maps broadcast network names to deep-link URLs (ESPN game page, Peacock, Paramount+, Apple TV, Max, MLB.TV, etc.). Regional sports networks stay non-clickable since they need a cable login.

## Deploying

Push to GitHub, Vercel auto-deploys. Set `ANTHROPIC_API_KEY` in Vercel project settings.
