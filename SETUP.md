# Should I Date This Man? — Setup Guide

## Prerequisites
- Node.js 18+ (install from https://nodejs.org or via `brew install node`)
- Anthropic API key (https://console.anthropic.com)

## Quick Start

```bash
cd should-i-date-this-man

# Install dependencies
npm install

# Copy env file and add your API key
cp .env.local.example .env.local
# Edit .env.local and add: ANTHROPIC_API_KEY=your_key_here

# Run dev server
npm run dev
```

Open http://localhost:3000

## Supabase Setup (Optional — for saving/sharing reports)

1. Create a free project at https://supabase.com
2. Go to SQL Editor and run the contents of `lib/supabase-schema.sql`
3. Copy your project URL and keys from Settings > API
4. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The app works without Supabase — you just won't get share links.

## Deploy to Vercel

```bash
npx vercel
```

Add `ANTHROPIC_API_KEY` in Vercel project settings > Environment Variables.

## Architecture

```
app/
  page.tsx              — Main page with input form
  api/roast/route.ts    — Claude API call + Supabase save
  share/[slug]/         — Shareable report pages
components/
  InputForm.tsx         — Profile input with URL, text, image upload
  ReportCard.tsx        — Full report card with download/share
  ScoreGauge.tsx        — Animated dateability score gauge
  LoadingState.tsx      — Sassy loading messages
lib/
  system-prompt.ts      — The sassy AI persona + prompt
  supabase.ts           — Database client (optional)
  utils.ts              — Helpers
types/
  index.ts              — TypeScript types
```

## Customization

### Change the AI persona
Edit `lib/system-prompt.ts` — the `ROAST_SYSTEM_PROMPT` constant.

### Add new archetypes
Add to the "Archetype Classification" section in the system prompt.

### Change the scoring algorithm
The scoring logic is entirely in Claude's hands based on the system prompt.
Adjust the score interpretation labels in `lib/utils.ts → getScoreLabel()`.
