# ROBONOTES — Setup Guide

A fully persistent notes/resource portal for M.Tech Robotics.  
Backed by **Supabase** 

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

