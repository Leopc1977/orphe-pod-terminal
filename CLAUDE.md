# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js + Turbopack)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Environment Variables

Required in `.env.local`:
- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` — Spotify OAuth app credentials
- `REDIRECT_TARGET` — OAuth callback URL (e.g. `http://localhost:3000`)
- `NEXT_PUBLIC_LLM_BASE_URL` — OpenAI-compatible LLM endpoint
- `NEXT_PUBLIC_LLM_API_KEY` — API key for the LLM
- `NEXT_PUBLIC_MODEL_NAME` — Model name to use for mood analysis

## Architecture

This is a **Next.js 15** app that renders a browser-based terminal (xterm.js) for analyzing personal Spotify listening history.

### Data flow

1. **Import** — Users upload Spotify extended history JSON files via a hidden `<input type="file">`. `TerminalView.jsx` parses two formats (new extended history with `master_metadata_*` fields, and older format) and bulk-inserts records into **IndexedDB** via Dexie (`src/lib/IndexDB/db.js`). Schema: `{ id, ms_played, ts, artistName, trackName, uri, IDTrack }`.

2. **Query** — `src/lib/Spotify/getTracks.js` reads from IndexedDB and uses **Arquero** for in-browser data manipulation (filtering by year, groupby, count, join). Other files in `src/lib/Spotify/` wrap `getTracks` with specific aggregation logic (top songs, top artists, top genres, new artists/genres, total stream time).

3. **Display** — `src/lib/Terminal/TerminalManager.js` is a class wrapping an xterm.js instance. Commands are registered via `addCommand(factory)` where each factory returns `{ name, desc, action }`. The `action` runs with `this` bound to the `TerminalManager` instance, giving access to `this.writeln()`, `this.write()`, and `this.spotifySDK`. `displayBarChart` in `src/lib/Terminal/commands/utils/displayBarChart.js` is the shared rendering utility for bar charts (uses ANSI color codes and `string-width` for Unicode-safe padding).

4. **Spotify API** — The live Spotify Web API (`@spotify/web-api-ts-sdk`) is used for some commands (e.g. `getTopTracksByYear`). OAuth is implemented via two Next.js API routes: `/api/login` (redirects to Spotify) and `/api/callback` (exchanges code for tokens). After login, `SpotifyApi.withAccessToken(...)` is stored in Zustand and passed to `TerminalManager.setSpotifySDK()`.

5. **Mood analysis** — `getMood.js` queries local history, builds a prompt, and calls an OpenAI-compatible LLM endpoint to return a narrative mood analysis. The LLM URL/key/model are configured via env vars.

### Adding a new command

1. Create `src/lib/Terminal/commands/my-command.js` exporting a factory function returning `{ name, desc, action }`.
2. Add a data-fetching function in `src/lib/Spotify/` if needed (use `getTracks` as the base).
3. Register it in `src/lib/Terminal/TerminalManager.js` by importing and calling `this.addCommand(myCommand)` in the constructor.

### State management

Zustand store (`src/lib/useStore/store.js`) holds: Spotify OAuth tokens, the `TerminalManager` instance, and the `SpotifyApi` SDK instance. The store is accessed in `TerminalView.jsx` to wire everything together on mount.
