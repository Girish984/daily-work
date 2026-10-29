# DailyWork – Short-term Jobs Marketplace (Bengaluru)

A full-stack starter React (Next.js) app for finding and posting **1-day**, **2-day**, and **weekly** temporary jobs.

## Features

- **Browse jobs** with filters (duration, area, category, search)
- **Post a job** (employers) – set wage, location, slots, start date
- **Apply to jobs** (workers) with optional message
- **Worker profiles & ratings**
- **Location-based** (Bengaluru areas)
- **Simple messaging** between workers & employers
- **Role-based UI** (Worker / Employer)
- Data persisted in `localStorage` (demo / starter)

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Client-side state + localStorage (no backend required for demo)

## Run locally

```bash
cd daily-work
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo accounts

On the Login page you can pick sample users:

**Workers**
- Ramesh Kumar (Koramangala) – Masonry, Painting
- Priya Sharma (HSR Layout) – Cleaning
- Anil Reddy (Whitefield) – Delivery
- Lakshmi Devi (Jayanagar) – Event Staff

**Employers**
- Suresh Patel (Indiranagar)
- BuildTech Constructions (Electronic City)

## Project structure

```
src/
  app/           # Pages (/, /login, /post-job, /jobs/[id], /workers, /messages, /profile)
  components/    # Navbar, JobCard, WorkerCard
  context/       # AppContext (state + localStorage)
  lib/           # Mock data
  types/         # TypeScript interfaces
```

## Next steps to production

1. Replace localStorage with a real database (Postgres / Mongo + Prisma)
2. Add proper authentication (NextAuth / Clerk)
3. Add real-time chat (Socket.io or Supabase)
4. Location / maps integration
5. Payment / wage settlement flow
6. Push notifications & SMS
7. Admin panel for moderation

---

Built as a starter for short-term / daily-wage work marketplace in Bengaluru.
