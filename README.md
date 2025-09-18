# Talent Hub – Full‑Stack Documentation

Talent Hub is a full‑stack platform for talent management. Applicants can register, browse and apply for jobs; employers can post and manage jobs and review applicants; admins have oversight with analytics and management tools.

---

## Tech Stack

- Backend: Node.js, Express, Mongoose (MongoDB), JWT, express‑validator, Helmet, CORS, Morgan
- Frontend: React Router 7 + Vite, TypeScript, Tailwind CSS
- Auth: JWT access/refresh, role‑based access control, optional Google OAuth

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)

### Install

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Environment

Copy and edit env files:

```bash
cp backend/env.example backend/.env
```

Key backend variables:

- PORT, NODE_ENV
- FRONTEND_URL (comma‑separated origins for CORS)
- MONGODB_URI
- JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (for Google SSO)

Frontend uses `VITE_API_BASE_URL` and optional `VITE_TOKEN_STORAGE` ("cookie" | "localStorage").

### Run

Backend:

```bash
cd backend
npm run dev        # http://localhost:5000
```

Frontend:

```bash
cd frontend
npm run dev        # http://localhost:5173
```

Database seed/reset:

```bash
cd backend
npm run seed       # seed with mock data
npm run seed:clear # clear all collections
npm run seed:reset # clear + seed
npm run seed:stats # show counts
```

---

## Backend API

Base URL: `http://localhost:5000`

### Health

- GET `/health` → service status
- GET `/api` → API index and advertised route bases

### Authentication (`/api/auth`)

- POST `/register` → body `{ name, email, password, role? }` returns `{ user, accessToken, refreshToken, redirectTo }`
- POST `/login` → body `{ email, password }` returns `{ user, accessToken, refreshToken, redirectTo }`
- GET `/login?email=..&password=..` → convenience GET login
- POST `/refresh` → refresh tokens from body `{ refreshToken }` or cookie; returns tokens
- GET `/profile` → requires `Authorization: Bearer <accessToken>`; returns `{ user }`
- Google OAuth (optional):
  - GET `/google/start?role=employee|employer` → redirects to Google
  - GET `/google/callback` → sets httpOnly cookies and redirects to frontend

Auth headers/cookies:

- Bearer tokens are accepted via `Authorization: Bearer <accessToken>`
- Refresh flow supported via JSON body and httpOnly cookies
- Roles: `employee`, `employer`, `admin`

### Jobs (`/api/jobs`)

- GET `/` → list jobs with filters: `page, limit, search, jobType, jobSite, experienceLevel, sector, status, sortBy, sortOrder`
- GET `/:id` → get single job (auth required)
- POST `/` → create job (auth + role `employer`): body `{ title, description, jobType, jobSite, location{city,country}, skills?, sector?, experienceLevel?, deadline }`
- PUT `/:id` → update job (auth + role `admin|employer`)
- DELETE `/:id` → delete job (auth + role `admin|employer`)
- GET `/user/:userId` → jobs by creator (auth + role `admin|employer`)

Validation: `express-validator` via `createJobValidator` and Mongoose schema constraints. Errors respond `{ error: "..." }` with 400.

### Applications (`/api/applications`)

- POST `/` → apply to a job (auth). Body `{ jobId, resumeUrl, coverLetter? }`. Validates job exists and is OPEN. Prevents duplicate applications.
- GET `/:userId` → list a user’s applications (auth; only self or admin). Returns populated job info.

### Admin (`/api/admin`) – requires role `admin`

- Dashboard & system:
  - GET `/dashboard` → overview counts, growth, recents
  - GET `/system/health` → db/server metrics
- Users:
  - GET `/users` → pagination, search, role filter
  - GET `/users/:userId`
  - PATCH `/users/:userId/role` → `{ role }`
  - DELETE `/users/:userId`
- Jobs:
  - GET `/jobs`
  - PATCH `/jobs/:jobId/status` → `{ status: OPEN|CLOSED }`
  - DELETE `/jobs/:jobId`
- Applications:
  - GET `/applications`
  - PATCH `/applications/:applicationId/status` → `{ status: applied|shortlisted|rejected }`

### Trends (`/api/trends`) – requires role `admin`

- GET `/jobs` → time‑series of job counts/types/sectors (`period=7d|30d|90d|1y`, `groupBy=day|week|month`)
- GET `/applications` → time‑series of application counts/success rates/applications per job
- GET `/users` → registration trends by role
- GET `/analytics` → top jobs, top employers, conversion funnel

### Data Models (Mongoose)

- `User`: `{ name, email(unique), password(hashed), role(employee|employer|admin) }`
- `Job`: `{ title, description, jobType, jobSite, location{city,country}, skills[], sector, experienceLevel, deadline, createdBy(ref User), status }` + text index for search
- `Application`: `{ jobId(ref Job), userId(ref User), resumeUrl, coverLetter?, status(applied|shortlisted|rejected) }` + unique index `(jobId,userId)`

### Error Handling

- 400 validation errors: `{ error: "..." }`
- 401: missing/invalid token
- 403: insufficient permissions
- 404: resource not found
- 409: duplicates (email in use, already applied)
- 500: internal server error

---

## Frontend Integration

API base selection (`app/lib/api.ts`):

- `API_BASE_URL = VITE_API_BASE_URL || process.env.BASE_URL || "http://localhost:5000"`
- All requests include `credentials: "include"` for cookie‑based flows
- Auto refresh: on 401, POST `/api/auth/refresh` with stored refresh token; on success, retries the original request

Token storage (`app/lib/auth.ts`):

- `VITE_TOKEN_STORAGE`: "cookie" or "localStorage" (default localStorage)
- Helpers: `setTokens`, `getAccessToken`, `getRefreshToken`, `clearTokens`, `getRoleFromToken`

Common calls:

```ts
import { getJson, postJson } from "./app/lib/api";

// List jobs
const jobs = await getJson<{ jobs: any[]; pagination: any }>("/api/jobs?page=1&limit=10");

// Create job (employer)
await postJson("/api/jobs", {
  title: "Senior Developer",
  description: "Build features...",
  jobType: "FULL_TIME",
  jobSite: "REMOTE",
  location: { city: "Paris", country: "FR" },
  deadline: new Date(Date.now() + 7 * 24 * 3600e3).toISOString(),
});
```

---

## Security Notes

- Use strong `JWT_SECRET`; rotate periodically
- Prefer cookie storage in production (`VITE_TOKEN_STORAGE=cookie`) with Secure/Lax
- Set `FRONTEND_URL` to trusted origins only
- Validate all inputs server‑side; keep Mongo indexes in sync after seeding
- Never log sensitive data

## Deployment

- Backend: set `NODE_ENV=production`, configure `PORT`, `MONGODB_URI`, `FRONTEND_URL`, JWT, Google SSO
- Frontend: set `VITE_API_BASE_URL` to backend URL

## Project Structure (condensed)

```
backend/
  src/{app.js, server.js, routes/, controllers/, models/, middleware/, validators/, utils/, config/}
  env.example
frontend/
  app/{lib/, components/, pages/, routes/}
```

## License

ISC
