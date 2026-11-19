# ROBONOTES — Setup Guide

A fully persistent notes/resource portal for M.Tech Robotics, Semester 01.  
Backed by **Supabase** (free tier — no credit card needed).

---

## Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React 19 + Vite               |
| Routing  | React Router v7               |
| Database | Supabase (PostgreSQL)         |
| Storage  | Supabase Storage (file uploads)|
| Hosting  | Vercel / Netlify (free)       |

---

## Step 1 — Create a free Supabase project

1. Go to **https://supabase.com** and sign up (free).
2. Click **New project** → give it a name (e.g. `robonotes`) → pick a region close to India → set a DB password (save it somewhere).
3. Wait ~2 minutes for it to provision.

---

## Step 2 — Run the SQL migration

1. In your Supabase dashboard: **SQL Editor → New query**.
2. Open `supabase_setup.sql` from this project, copy the whole file, paste it, click **Run**.
3. You should see: `Success. No rows returned.`

---

## Step 3 — Create Storage buckets

1. In Supabase dashboard: **Storage → New bucket**.
2. Create **two** buckets, one at a time:
   - `resources` → tick **Public bucket** → Save
   - `papers`    → tick **Public bucket** → Save

---

## Step 4 — Get your API keys

1. Supabase dashboard → **Settings → API**.
2. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public** key (the long JWT string)

---

## Step 5 — Configure the .env file

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_PASSWORD=robotics2026
```

> Change `VITE_ADMIN_PASSWORD` to whatever password you want. This is  
> the password used to unlock the admin panel AND to delete any item.

---

## Step 6 — Install & run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173** — you should see the app.

---

## Step 7 — Deploy (optional, free)

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```
Add the three env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_PASSWORD`) in Vercel → Project → Settings → Environment Variables.

**Netlify:** Same env vars in Site settings → Environment.

---

## Features

| Feature                     | How it works                               |
|-----------------------------|--------------------------------------------|
| Upload PDF / PPT / DOC / ZIP| File goes to Supabase Storage, public URL saved to DB |
| Add YouTube / web links     | URL stored directly in DB                 |
| Persistent across refreshes | Supabase PostgreSQL — data never lost      |
| Search                      | Live search across all three tables        |
| Subject filter              | URL-based filter chips on Resources page  |
| Delete protection           | Requires admin password prompt            |
| .env security               | Keys never committed to git               |

---

## Project structure

```
src/
  components/
    AdminModal.jsx      ← login + upload forms
    ResourceRow.jsx     ← single file/link row
    SearchResults.jsx   ← search overlay
    Sidebar.jsx         ← nav sidebar
    Topbar.jsx          ← top bar + search input
  context/
    AdminContext.jsx    ← isAdmin state app-wide
  hooks/
    useResources.js     ← Supabase CRUD per table
    useSearch.js        ← cross-table search
  lib/
    constants.js        ← subjects, helpers
    supabaseClient.js   ← Supabase singleton
  pages/
    Overview.jsx        ← home dashboard
    ResourcesPage.jsx   ← all resources + filter
    ListPage.jsx        ← papers / videos
  App.jsx               ← routing + layout
  main.jsx              ← entry point
```
