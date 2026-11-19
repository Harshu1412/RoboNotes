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



1. In your Supabase dashboard: **SQL Editor → New query**.
2. Open `supabase_setup.sql` from this project, copy the whole file, paste it, click **Run**.
3. You should see: `Success. No rows returned.`

---



```bash
npm install
npm run dev
```



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
