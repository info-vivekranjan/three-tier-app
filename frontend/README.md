# Three-tier-app - Frontend

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:6800/api
```

## Features

- **Landing page** — with feature overview and auth CTAs
- **Login / Register** — with avatar upload
- **Notes** — CRUD with file attachments, category badges, pagination
- **ParaGraphix** — Rich text editor (Quill.js) with category support
- **Markdown Editor** — Split editor/preview with live rendering, .md download
- **Profile** — User info display with avatar
- **Navbar** — Fixed, with profile menu and logout

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- DM Sans + DM Serif Display fonts
- Quill.js (rich text, loaded dynamically)
- No external UI library — pure Tailwind only

## Design

Dark editorial theme: `stone-950` backgrounds, `amber-400` accents, serif typography.
