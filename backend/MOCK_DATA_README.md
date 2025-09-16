# Mock Data and API Documentation

## Overview

This document describes the mock data and API endpoints available in the Talent Hub backend. The system includes comprehensive mock data for users, jobs, and applications to facilitate development and testing.

## Mock Data Structure

### Users (8 total)
- **1 Admin**: john.smith@example.com
- **2 employers**: sarah.johnson@example.com, mike.wilson@example.com
- **5 applicants**: emily.davis@example.com, david.brown@example.com, lisa.anderson@example.com, tom.miller@example.com, jessica.taylor@example.com

All users have the password: `password123`

### Jobs (10 total)
The mock jobs cover various sectors and experience levels:

1. **Senior Full Stack Developer** (Remote, Technology, SENIOR)
2. **Frontend Developer** (Hybrid, Technology, MID)
3. **Backend Developer** (Onsite, Technology, SENIOR)
4. **DevOps Engineer** (Remote, Technology, MID)
5. **Data Scientist** (Hybrid, Data Science, SENIOR)
6. **UI/UX Designer** (Remote, Design, MID)
7. **Product Manager** (Onsite, Product, SENIOR)
8. **Marketing Specialist** (Hybrid, Marketing, MID)
9. **Sales Representative** (Onsite, Sales, JUNIOR)
10. **Customer Success Manager** (Remote, Customer Success, MID)

### Applications (5 total)
Mock applications with different statuses:
- 3 applications with "applied" status
- 1 application with "shortlisted" status
- 1 application with "rejected" status

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "applicant" // optional: admin, employer, applicant
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Jobs (`/api/jobs`)

#### GET `/api/jobs`
Get all jobs with optional filtering and pagination

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `search` - Search in title, description, skills, sector
- `jobType` - FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE
- `jobSite` - ONSITE, REMOTE, HYBRID
- `experienceLevel` - JUNIOR, MID, SENIOR
- `sector` - Filter by sector
- `status` (default: OPEN) - OPEN, CLOSED
- `sortBy` (default: createdAt) - Field to sort by
- `sortOrder` (default: desc) - asc, desc

**Example:**
```
GET /api/jobs?search=developer&jobType=FULL_TIME&experienceLevel=SENIOR&page=1&limit=5
```

#### GET `/api/jobs/:id`
Get a specific job by ID

#### POST `/api/jobs`
Create a new job (requires authentication)

**Request Body:**
```json
{
  "title": "Software Engineer",
  "description": "We are looking for a skilled software engineer...",
  "jobType": "FULL_TIME",
  "jobSite": "REMOTE",
  "location": {
    "city": "San Francisco",
    "country": "USA"
  },
  "skills": ["JavaScript", "React", "Node.js"],
  "sector": "Technology",
  "experienceLevel": "MID",
  "deadline": "2024-02-15T23:59:59.000Z"
}
```

#### PUT `/api/jobs/:id`
Update a job (requires authentication and ownership)

#### DELETE `/api/jobs/:id`
Delete a job (requires authentication and ownership)

#### GET `/api/jobs/user/:userId`
Get jobs created by a specific user

### Applications (`/api/applications`)

#### POST `/api/applications`
Apply to a job (requires authentication)

**Request Body:**
```json
{
  "jobId": "job_id_here",
  "resumeUrl": "https://example.com/resume.pdf",
  "coverLetter": "I am interested in this position..." // optional
}
```

#### GET `/api/applications/:userId`
Get applications for a specific user (requires authentication)

## Seeding Commands

### Available Scripts

```bash
# Seed the database with mock data
npm run seed

# Clear all data from the database
npm run seed:clear

# Reset database (clear + seed)
npm run seed:reset

# Show database statistics
npm run seed:stats
```

### Manual Seeding

You can also use the seeder functions directly in your code:

```javascript
import { seedDatabase, clearDatabase, getDatabaseStats } from './src/utils/seedData.js';

// Seed the database
const result = await seedDatabase();
console.log(`Created ${result.users} users, ${result.jobs} jobs, ${result.applications} applications`);

// Clear the database
await clearDatabase();

// Get statistics
const stats = await getDatabaseStats();
console.log(stats);
```

## Data Relationships

- **Users** can create multiple **Jobs** (employers/admins)
- **Users** can apply to multiple **Jobs** (applicants)
- **Applications** link **Users** to **Jobs** with a unique constraint (one application per user per job)

## Features

### Job Search and Filtering
- Full-text search across title, description, skills, and sector
- Filter by job type, location type, experience level, and sector
- Pagination support
- Sorting by any field

### Application Management
- Prevent duplicate applications
- Status tracking (applied, shortlisted, rejected)
- Resume URL validation
- Cover letter support

### Security
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS and security headers

## Testing the API

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Seed the database:**
   ```bash
   npm run seed
   ```

3. **Test endpoints:**
   ```bash
   # Get all jobs
   curl http://localhost:5000/api/jobs

   # Search for developer jobs
   curl "http://localhost:5000/api/jobs?search=developer"

   # Register a new user
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

   # Login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john.smith@example.com","password":"password123"}'
   ```

## Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: admin, employer, applicant),
  createdAt: Date,
  updatedAt: Date
}
```

### Job Schema
```javascript
{
  title: String (required),
  description: String (required),
  jobType: String (enum: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE),
  jobSite: String (enum: ONSITE, REMOTE, HYBRID),
  location: {
    city: String (required),
    country: String (required)
  },
  skills: [String],
  sector: String,
  experienceLevel: String (enum: JUNIOR, MID, SENIOR),
  deadline: Date (required),
  createdBy: ObjectId (ref: User),
  status: String (enum: OPEN, CLOSED),
  createdAt: Date,
  updatedAt: Date
}
```

### Application Schema
```javascript
{
  jobId: ObjectId (ref: Job, required),
  userId: ObjectId (ref: User, required),
  resumeUrl: String (required, URL validation),
  coverLetter: String (optional, max 2000 chars),
  status: String (enum: applied, shortlisted, rejected),
  createdAt: Date,
  updatedAt: Date
}
```

## Notes

- All timestamps are automatically managed by Mongoose
- Password hashing is handled by bcryptjs
- JWT tokens are used for authentication
- The system includes comprehensive error handling and validation
- All endpoints return consistent JSON responses
- CORS is configured for frontend integration
