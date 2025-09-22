# Talent Hub – Full-Stack Documentation

Talent Hub is a full-stack platform for talent management. Applicants can register, browse, and apply for jobs; employers can post and manage jobs and review applicants; admins have oversight with analytics and management tools.

---

## Tech Stack

- Backend: Node.js, Express, Mongoose (MongoDB), JWT, express-validator, Helmet, CORS, Morgan
- Frontend: React Router 7 + Vite, TypeScript, Tailwind CSS
- Auth: JWT access/refresh, role-based access control, optional Google OAuth
- File Upload: Cloudinary for resume storage

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)
- Cloudinary account (for resume uploads)

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

- `PORT`, `NODE_ENV`
- `FRONTEND_URL` (comma-separated origins for CORS)
- `MONGODB_URI`
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (for Google SSO)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (for resume uploads)

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

- **POST `/register`** → body `{ name, email, password, role? }` returns `{ user, accessToken, refreshToken, redirectTo }`
  - Validates `name` (min 2 chars), `email` (unique, valid format), `password` (min 6 chars)
  - `role` defaults to `employee` unless `employer` is specified
- **POST `/login`** → body `{ email, password }` returns `{ user, accessToken, refreshToken, redirectTo }`
- **GET `/login?email=..&password=..`** → convenience GET login
- **POST `/refresh`** → refresh tokens from body `{ refreshToken }` or cookie; returns `{ user, accessToken, refreshToken }`
- **GET `/profile`** → requires `Authorization: Bearer <accessToken>`; returns `{ user }` with user details (excludes password)
- Google OAuth (optional):
  - **GET `/google/start?role=employee|employer`** → redirects to Google with CSRF protection
  - **GET `/google/callback`** → sets httpOnly cookies and redirects to frontend with tokens in query params (`accessToken`, `refreshToken`, `role`)

Auth headers/cookies:

- Bearer tokens are accepted via `Authorization: Bearer <accessToken>`
- Refresh flow supported via JSON body and httpOnly cookies
- Roles: `employee`, `employer`, `admin`

### Jobs (`/api/jobs`)

#### 1. Get All Jobs
Retrieve a list of jobs with optional filtering and pagination.

- **Method**: GET
- **Path**: `/jobs`
- **Query Parameters**:
  - `page` (optional, number, default: 1): Page number.
  - `limit` (optional, number, default: 10): Jobs per page.
  - `search` (optional, string): Filter by title, description, skills, or sector (case-insensitive).
  - `jobType` (optional, string): `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `FREELANCE`.
  - `jobSite` (optional, string): `ONSITE`, `REMOTE`, `HYBRID`.
  - `experienceLevel` (optional, string): `JUNIOR`, `MID`, `SENIOR`.
  - `sector` (optional, string): Filter by sector (case-insensitive).
  - `status` (optional, string, default: `OPEN`): `OPEN`, `CLOSED`.
  - `sortBy` (optional, string, default: `createdAt`): Field to sort by (e.g., `title`, `deadline`).
  - `sortOrder` (optional, string, default: `desc`): `asc` or `desc`.
- **Response**:
  - **200 OK**:
    ```json
    {
      "jobs": [
        {
          "_id": "string",
          "title": "string",
          "description": "string",
          "jobType": "string",
          "jobSite": "string",
          "location": { "city": "string", "country": "string" },
          "skills": ["string"],
          "sector": "string",
          "experienceLevel": "string",
          "deadline": "string (ISO 8601)",
          "createdBy": { "_id": "string", "name": "string", "email": "string" },
          "status": "string",
          "createdAt": "string (ISO 8601)",
          "updatedAt": "string (ISO 8601)"
        }
      ],
      "pagination": {
        "currentPage": number,
        "totalPages": number,
        "totalJobs": number,
        "hasNext": boolean,
        "hasPrev": boolean
      }
    }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error" }
    ```
- **Example**:
  ```
  GET /api/jobs?page=2&limit=5&search=developer&jobType=FULL_TIME
  ```

#### 2. Get Job by ID
Retrieve a single job by its ID.

- **Method**: GET
- **Path**: `/jobs/:id`
- **Authentication**: Required
- **Parameters**:
  - `id` (path, string): Job ID.
- **Response**:
  - **200 OK**:
    ```json
    {
      "job": {
        "_id": "string",
        "title": "string",
        "description": "string",
        "jobType": "string",
        "jobSite": "string",
        "location": { "city": "string", "country": "string" },
        "skills": ["string"],
        "sector": "string",
        "experienceLevel": "string",
        "deadline": "string (ISO 8601)",
        "createdBy": { "_id": "string", "name": "string", "email": "string" },
        "status": "string",
        "createdAt": "string (ISO 8601)",
        "updatedAt": "string (ISO 8601)"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid job ID" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Job not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error" }
    ```
- **Example**:
  ```
  GET /api/jobs/68c9d9935aa91b8266b06533
  Authorization: Bearer <token>
  ```

#### 3. Create Job
Create a new job posting.

- **Method**: POST
- **Path**: `/jobs`
- **Authentication**: Required (role: `employer`)
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "jobType": "string (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE)",
    "jobSite": "string (ONSITE, REMOTE, HYBRID)",
    "location": { "city": "string", "country": "string" },
    "skills": ["string"],
    "sector": "string",
    "experienceLevel": "string (JUNIOR, MID, SENIOR)",
    "deadline": "string (ISO 8601)"
  }
  ```
- **Validation Rules**:
  - `title`: Required, 3-100 characters.
  - `description`: Required, at least 20 characters.
  - `jobType`: Optional, one of `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `FREELANCE` (default: `FULL_TIME`).
  - `jobSite`: Optional, one of `ONSITE`, `REMOTE`, `HYBRID` (default: `ONSITE`).
  - `location.city`: Required, string.
  - `location.country`: Required, string.
  - `skills`: Optional, array of strings.
  - `sector`: Optional, string.
  - `experienceLevel`: Optional, one of `JUNIOR`, `MID`, `SENIOR` (default: `MID`).
  - `deadline`: Required, future ISO 8601 date.
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Job created successfully",
      "job": { /* Same structure as GET /jobs/:id */ }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Job title is required, Job description must be at least 20 characters" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error" }
    ```
- **Example**:
  ```
  POST /api/jobs
  Authorization: Bearer <token>
  Content-Type: application/json
  {
    "title": "Senior Full Stack Developer",
    "description": "Develop web applications using React and Node.js.",
    "jobType": "FULL_TIME",
    "jobSite": "REMOTE",
    "location": { "city": "San Francisco", "country": "USA" },
    "skills": ["React", "Node.js"],
    "sector": "Technology",
    "experienceLevel": "SENIOR",
    "deadline": "2025-10-17T00:00:00Z"
  }
  ```

#### 4. Update Job
Update an existing job by its ID.

- **Method**: PUT
- **Path**: `/jobs/:id`
- **Authentication**: Required (role: `admin` or `employer`)
- **Parameters**:
  - `id` (path, string): Job ID.
- **Request Body**: Same as `POST /jobs` (partial updates allowed).
- **Validation Rules**: Same as `POST /jobs` for provided fields; `deadline` must be a future date.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Job updated successfully",
      "job": { /* Same structure as GET /jobs/:id */ }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid job ID" }
    ```
    or
    ```json
    { "error": "Job title must be at least 3 characters long, Deadline must be in the future" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Job not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error" }
    ```
- **Example**:
  ```
  PUT /api/jobs/68c9d9935aa91b8266b06533
  Authorization: Bearer <token>
  Content-Type: application/json
  {
    "title": "Updated Senior Full Stack Developer",
    "deadline": "2025-11-01T00:00:00Z"
  }
  ```

#### 5. Delete Job
Delete a job by its ID.

- **Method**: DELETE
- **Path**: `/jobs/:id`
- **Authentication**: Required (role: `admin` or `employer`)
- **Parameters**:
  - `id` (path, string): Job ID.
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Job deleted successfully" }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid job ID" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Job not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error" }
    ```
- **Example**:
  ```
  DELETE /api/jobs/68c9d9935aa91b8266b06533
  Authorization: Bearer <token>
  ```

#### 6. Get Jobs by User
Retrieve jobs created by a specific user with pagination.

- **Method**: GET
- **Path**: `/jobs/user/:userId`
- **Authentication**: Required (role: `admin` or `employer`)
- **Parameters**:
  - `userId` (path, string): User ID.
- **Query Parameters**:
  - `page` (optional, number, default: 1): Page number.
  - `limit` (optional, number, default: 10): Jobs per page.
- **Response**:
  - **200 OK**:
    ```json
    {
      "jobs": [ /* Same structure as GET /jobs */ ],
      "pagination": {
        "currentPage": number,
        "totalPages": number,
        "totalJobs": number,
        "hasNext": boolean,
        "hasPrev": boolean
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid user ID" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "User not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error" }
    ```
- **Example**:
  ```
  GET /api/jobs/user/68c9d9935aa91b8266b06533?page=1&limit=5
  Authorization: Bearer <token>
  ```

### Applications (`/api/applications`)

#### 1. Get Employer Applications
Retrieve all applications for jobs created by the authenticated employer.

- **Method**: GET
- **Path**: `/applications/employer`
- **Authentication**: Required (role: `employer` or `admin`)
- **Response**:
  - **200 OK**:
    ```json
    {
      "applications": [
        {
          "_id": "string",
          "jobId": {
            "_id": "string",
            "title": "string",
            "location": { "city": "string", "country": "string" },
            "status": "string"
          },
          "userId": {
            "_id": "string",
            "name": "string",
            "email": "string",
            "role": "string"
          },
          "resume": {
            "url": "string",
            "publicId": "string",
            "originalName": "string",
            "format": "string"
          },
          "coverLetter": "string",
          "status": "string",
          "createdAt": "string (ISO 8601)",
          "updatedAt": "string (ISO 8601)"
        }
      ]
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "User is not an employer" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "User not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error" }
    ```
- **Example**:
  ```
  GET /api/applications/employer
  Authorization: Bearer <token>
  ```

#### 2. Get Applications by Job
Retrieve all applications for a specific job, accessible to the job’s creator or an admin.

- **Method**: GET
- **Path**: `/applications/job/:jobId`
- **Authentication**: Required (role: `employer` (job creator) or `admin`)
- **Parameters**:
  - `jobId` (path, string): Job ID.
- **Response**:
  - **200 OK**:
    ```json
    {
      "applications": [
        {
          "_id": "string",
          "jobId": {
            "_id": "string",
            "title": "string",
            "location": { "city": "string", "country": "string" },
            "status": "string"
          },
          "userId": {
            "_id": "string",
            "name": "string",
            "email": "string",
            "role": "string"
          },
          "resume": {
            "url": "string",
            "publicId": "string",
            "originalName": "string",
            "format": "string"
          },
          "coverLetter": "string",
          "status": "string",
          "createdAt": "string (ISO 8601)",
          "updatedAt": "string (ISO 8601)"
        }
      ]
    }
    ```
  - **403 Forbidden**:
    ```json
    { "error": "Forbidden" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Job not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error" }
    ```
- **Example**:
  ```
  GET /api/applications/job/68c9d9935aa91b8266b06533
  Authorization: Bearer <token>
  ```

#### 3. Apply to Job
Submit a new application for a job, including a resume file upload or using a previously uploaded resume.

- **Method**: POST
- **Path**: `/applications`
- **Authentication**: Required (role: `employee`)
- **Request Body** (multipart/form-data):
  - `jobId` (string, required): Job ID.
  - `resume` (file, optional): Resume file (PDF or DOCX, uploaded to Cloudinary). Required if user has no saved resume.
  - `coverLetter` (string, optional): Cover letter text (max 2000 characters).
- **Validation Rules**:
  - `jobId`: Required, valid MongoDB ObjectId, must correspond to an existing job.
  - `resume`: Required if user has no saved resume in profile; must be PDF or DOCX.
  - `coverLetter`: Optional, max 2000 characters.
  - Job must have `status: "OPEN"`.
  - User cannot apply to the same job twice (enforced by unique index on `jobId` and `userId`).
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Application submitted successfully",
      "application": {
        "_id": "string",
        "jobId": {
          "_id": "string",
          "title": "string",
          "location": { "city": "string", "country": "string" },
          "status": "string"
        },
        "userId": {
          "_id": "string",
          "name": "string",
          "email": "string",
          "role": "string"
        },
        "resume": {
          "url": "string",
          "publicId": "string",
          "originalName": "string",
          "format": "string"
        },
        "coverLetter": "string",
        "status": "string",
        "createdAt": "string (ISO 8601)",
        "updatedAt": "string (ISO 8601)"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Job ID is required, No resume provided or saved in profile" }
    ```
    or
    ```json
    { "error": "Job is not open for applications" }
    ```
    or
    ```json
    { "error": "Invalid job ID format" }
    ```
  - **401 Unauthorized**:
    ```json
    { "error": "Unauthorized" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Job not found" }
    ```
  - **409 Conflict**:
    ```json
    { "error": "You have already applied to this job" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error", "message": "..." }
    ```
- **Example**:
  ```
  POST /api/applications
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
  jobId=68c9d9935aa91b8266b06533
  resume=<file.pdf>
  coverLetter=Dear Hiring Manager, I am excited to apply...
  ```

#### 4. Get User Applications
Retrieve all applications submitted by a specific user, accessible to the user or an admin.

- **Method**: GET
- **Path**: `/applications/:userId`
- **Authentication**: Required (role: `admin` or matching `userId`)
- **Parameters**:
  - `userId` (path, string): User ID.
- **Response**:
  - **200 OK**:
    ```json
    {
      "applications": [
        {
          "_id": "string",
          "jobId": {
            "_id": "string",
            "title": "string",
            "description": "string",
            "location": { "city": "string", "country": "string" },
            "status": "string"
          },
          "userId": "string",
          "resume": {
            "url": "string",
            "publicId": "string",
            "originalName": "string",
            "format": "string"
          },
          "coverLetter": "string",
          "status": "string",
          "createdAt": "string (ISO 8601)",
          "updatedAt": "string (ISO 8601)"
        }
      ]
    }
    ```
  - **403 Forbidden**:
    ```json
    { "error": "Forbidden" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "User not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error" }
    ```
- **Example**:
  ```
  GET /api/applications/68c9d9935aa91b8266b06533
  Authorization: Bearer <token>
  ```

### Resume (`/api/resume`)

#### 1. Upload Resume
Upload a resume file for the authenticated user.

- **Method**: POST
- **Path**: `/resume`
- **Authentication**: Required (role: `employee`)
- **Request Body** (multipart/form-data):
  - `resume` (file, required): Resume file (PDF or DOCX, uploaded to Cloudinary).
- **Validation Rules**:
  - `resume`: Required, valid PDF or DOCX file.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Resume uploaded successfully",
      "data": {
        "url": "string",
        "publicId": "string",
        "originalName": "string",
        "format": "string"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "No file uploaded", "message": "Please select a resume file to upload" }
    ```
  - **401 Unauthorized**:
    ```json
    { "error": "Unauthorized" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Upload failed", "message": "..." }
    ```
- **Example**:
  ```
  POST /api/resume
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
  resume=<file.pdf>
  ```

#### 2. Get Resume
Retrieve the resume of the authenticated user.

- **Method**: GET
- **Path**: `/resume`
- **Authentication**: Required
- **Response**:
  - **200 OK**:
    ```json
    {
      "data": {
        "url": "string",
        "publicId": "string",
        "originalName": "string",
        "format": "string"
      }
    }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Resume not found", "message": "This user has not uploaded a resume" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Fetch failed", "message": "..." }
    ```
- **Example**:
  ```
  GET /api/resume
  Authorization: Bearer <token>
  ```

#### 3. Delete Resume
Delete the resume of the authenticated user.

- **Method**: DELETE
- **Path**: `/resume`
- **Authentication**: Required (role: `employee` or `admin`)
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Resume deleted successfully" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Resume not found", "message": "This user has no uploaded resume" }
    ```
  - **401 Unauthorized**:
    ```json
    { "error": "Unauthorized" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Delete failed", "message": "..." }
    ```
- **Example**:
  ```
  DELETE /api/resume
  Authorization: Bearer <token>
  ```

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

- GET `/jobs` → time-series of job counts/types/sectors (`period=7d|30d|90d|1y`, `groupBy=day|week|month`)
- GET `/applications` → time-series of application counts/success rates/applications per job
- GET `/users` → registration trends by role
- GET `/analytics` → top jobs, top employers, conversion funnel

### Data Models (Mongoose)

- **User**:
  ```javascript
  {
    name: { type: String, required, minlength: 2, trim: true },
    email: { type: String, required, unique, lowercase, trim, match: email regex },
    password: { type: String, required, minlength: 6 },
    role: { type: String, enum: ["employee", "employer", "admin"], default: "employee" },
    resume: {
      url: { type: String, validate: URL },
      publicId: { type: String },
      originalName: { type: String, trim: true },
      format: { type: String, trim: true }
    },
    profileImage: { type: String, validate: URL },
    professionalTitle: { type: String, trim: true, maxlength: 100 },
    industry: { type: String, trim: true, maxlength: 100 },
    experienceLevel: { type: String, enum: ["junior", "mid", "senior", "lead"] },
    phoneNumber: { type: String, match: phone regex (7-15 digits) },
    location: {
      city: { type: String, trim: true },
      country: { type: String, trim: true }
    },
    professionalSummary: { type: String, maxlength: 2000 },
    linkedInUrl: { type: String, validate: LinkedIn URL },
    githubUrl: { type: String, validate: GitHub URL },
    portfolioUrl: { type: String, validate: URL }
  }
  ```
  - Indexes: `email` (unique)
  - Pre-save: Hash password with bcrypt
  - Methods: `matchPassword` for password comparison
  - toJSON: Excludes `password`

- **Job**:
  ```javascript
  {
    title: { type: String, required, minlength: 3, maxlength: 100 },
    description: { type: String, required, minlength: 20 },
    jobType: { type: String, enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"], default: "FULL_TIME" },
    jobSite: { type: String, enum: ["ONSITE", "REMOTE", "HYBRID"], default: "ONSITE" },
    location: {
      city: { type: String, required },
      country: { type: String, required }
    },
    skills: [{ type: String }],
    sector: { type: String },
    experienceLevel: { type: String, enum: ["JUNIOR", "MID", "SENIOR"], default: "MID" },
    deadline: { type: Date, required },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required },
    status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" }
  }
  ```
  - Indexes: Text index on `title`, `description`, `skills`, `sector` for search

- **Application**:
  ```javascript
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required },
    userId: { type: Schema.Types.ObjectId, ref: "User", required },
    resume: {
      url: { type: String, required, validate: URL },
      publicId: { type: String, required },
      originalName: { type: String, trim: true },
      format: { type: String }
    },
    coverLetter: { type: String, maxlength: 2000 },
    status: { type: String, enum: ["applied", "shortlisted", "rejected"], default: "applied" }
  }
  ```
  - Indexes: Unique index on `jobId` and `userId` to prevent duplicate applications
  - Timestamps: `createdAt`, `updatedAt`

### Error Handling

- **400**: Validation errors (e.g., missing required fields, invalid formats)
- **401**: Missing or invalid token
- **403**: Insufficient permissions (e.g., wrong role or unauthorized access)
- **404**: Resource not found (e.g., job, user, or resume)
- **409**: Duplicates (e.g., email in use, already applied to job)
- **500**: Internal server error with optional `message`

---

## Frontend Integration

API base selection (`app/lib/api.ts`):

- `API_BASE_URL = VITE_API_BASE_URL || process.env.BASE_URL || "http://localhost:5000"`
- All requests include `credentials: "include"` for cookie-based flows
- Auto refresh: on 401, POST `/api/auth/refresh` with stored refresh token; on success, retries the original request

Token storage (`app/lib/auth.ts`):

- `VITE_TOKEN_STORAGE`: "cookie" or "localStorage" (default localStorage)
- Helpers: `setTokens`, `getAccessToken`, `getRefreshToken`, `clearTokens`, `getRoleFromToken`

Common calls:

```ts
import { getJson, postJson, postForm } from "./app/lib/api";

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

// Apply to job (employee)
const formData = new FormData();
formData.append("jobId", "68c9d9935aa91b8266b06533");
formData.append("coverLetter", "Dear Hiring Manager...");
formData.append("resume", file); // file is a File object from input (optional if user has saved resume)
await postForm("/api/applications", formData);

// Get user applications
const applications = await getJson<{ applications: any[] }>("/api/applications/68c9d9935aa91b8266b06533");

// Upload resume (employee)
const resumeForm = new FormData();
resumeForm.append("resume", file); // file is a File object from input
await postForm("/api/resume", resumeForm);

// Get resume
const resume = await getJson<{ data: { url: string, publicId: string, originalName: string, format: string } }>("/api/resume");

// Delete resume
await postJson("/api/resume", {}, { method: "DELETE" });
```

---

## Security Notes

- Use strong `JWT_SECRET`; rotate periodically
- Prefer cookie storage in production (`VITE_TOKEN_STORAGE=cookie`) with Secure/Lax
- Set `FRONTEND_URL` to trusted origins only
- Configure Cloudinary securely and restrict file types to PDF/DOCX
- Validate all inputs server-side; keep Mongo indexes in sync after seeding
- Never log sensitive data (e.g., passwords, tokens)
- Use CSRF protection for Google OAuth flows
- Ensure `resume` URLs are validated and stored securely in Cloudinary

## Deployment

- Backend: Set `NODE_ENV=production`, configure `PORT`, `MONGODB_URI`, `FRONTEND_URL`, JWT, Google SSO, Cloudinary credentials
- Frontend: Set `VITE_API_BASE_URL` to backend URL

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