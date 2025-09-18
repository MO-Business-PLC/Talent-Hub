# Talent Hub Backend

Backend API for Talent Hub - A platform for talent management and collaboration.

## Features

- Express.js server with security middleware
- CORS configuration for frontend integration
- Structured routing system
- Error handling middleware
- Environment configuration
- Development and production scripts

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.example .env
```

3. Update the `.env` file with your configuration

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` by default.

### API Endpoints

#### Health Check
- `GET /health` - Server health status

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

# Job API 

This API provides endpoints for managing job postings, including creating, retrieving, updating, and deleting jobs, as well as filtering jobs by various criteria and retrieving jobs by a specific user. All endpoints require authentication unless specified otherwise.

## Base URL
`/api/jobs`

## Authentication
- All endpoints except `GET /jobs/` require a valid JWT token passed in the `Authorization` header as `Bearer <token>`.
- The `POST /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id`, and `GET /jobs/user/:userId` endpoints require the user to have the `employer` or `admin` role, enforced by the `authorize` middleware.

## Validation
- The `POST /jobs` and `PUT /jobs/:id` endpoints use the `createJobValidator` middleware with `express-validator` to validate request bodies.
- Validation errors result in a `400 Bad Request` response with a comma-separated string of error messages, e.g.:
  ```json
  { "error": "Job title is required, Job description must be at least 20 characters" }
  ```

## Endpoints

### 1. Get All Jobs
Retrieve a list of jobs with optional filtering and pagination.

- **Method**: GET
- **Path**: `/jobs`
- **Query Parameters**:
  - `page` (optional, number, default: 1): Page number for pagination.
  - `limit` (optional, number, default: 10): Number of jobs per page.
  - `search` (optional, string): Search term to filter by title, description, skills, or sector (case-insensitive).
  - `jobType` (optional, string): Filter by job type (`FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `FREELANCE`).
  - `jobSite` (optional, string): Filter by job site (`ONSITE`, `REMOTE`, `HYBRID`).
  - `experienceLevel` (optional, string): Filter by experience level (`JUNIOR`, `MID`, `SENIOR`).
  - `sector` (optional, string): Filter by sector (case-insensitive).
  - `status` (optional, string, default: `OPEN`): Filter by job status (`OPEN`, `CLOSED`).
  - `sortBy` (optional, string, default: `createdAt`): Field to sort by (e.g., `title`, `deadline`).
  - `sortOrder` (optional, string, default: `desc`): Sort order (`asc` or `desc`).
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
          "location": {
            "city": "string",
            "country": "string"
          },
          "skills": ["string"],
          "sector": "string",
          "experienceLevel": "string",
          "deadline": "string (ISO 8601)",
          "createdBy": {
            "_id": "string",
            "name": "string",
            "email": "string"
          },
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
  GET /api/jobs?page=2&limit=5&search=developer&jobType=FULL_TIME&status=OPEN
  ```

### 2. Get Job by ID
Retrieve a single job by its ID.

- **Method**: GET
- **Path**: `/jobs/:id`
- **Authentication**: Required
- **Parameters**:
  - `id` (path, string): The ID of the job.
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
        "location": {
          "city": "string",
          "country": "string"
        },
        "skills": ["string"],
        "sector": "string",
        "experienceLevel": "string",
        "deadline": "string (ISO 8601)",
        "createdBy": {
          "_id": "string",
          "name": "string",
          "email": "string"
        },
        "status": "string",
        "createdAt": "string (ISO 8601)",
        "updatedAt": "string (ISO 8601)"
      }
    }
    ```
  - **400 Bad Request** (Invalid ID):
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

### 3. Create Job
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
    "location": {
      "city": "string",
      "country": "string"
    },
    "skills": ["string"],
    "sector": "string",
    "experienceLevel": "string (JUNIOR, MID, SENIOR)",
    "deadline": "string (ISO 8601)"
  }
  ```
- **Validation Rules** (enforced by `createJobValidator` and `jobSchema`):
  - `title`: Required, string, 3-100 characters.
  - `description`: Required, string, at least 20 characters.
  - `jobType`: Optional, must be one of `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `FREELANCE` (defaults to `FULL_TIME`).
  - `jobSite`: Optional, must be one of `ONSITE`, `REMOTE`, `HYBRID` (defaults to `ONSITE`).
  - `location.city`: Required, string.
  - `location.country`: Required, string.
  - `skills`: Optional, array of strings (defaults to empty array).
  - `sector`: Optional, string.
  - `experienceLevel`: Optional, must be one of `JUNIOR`, `MID`, `SENIOR` (defaults to `MID`).
  - `deadline`: Required, must be a valid ISO 8601 date in the future.
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Job created successfully",
      "job": {
        "_id": "string",
        "title": "string",
        "description": "string",
        "jobType": "string",
        "jobSite": "string",
        "location": {
          "city": "string",
          "country": "string"
        },
        "skills": ["string"],
        "sector": "string",
        "experienceLevel": "string",
        "deadline": "string (ISO 8601)",
        "createdBy": {
          "_id": "string",
          "name": "string",
          "email": "string"
        },
        "status": "string",
        "createdAt": "string (ISO 8601)",
        "updatedAt": "string (ISO 8601)"
      }
    }
    ```
  - **400 Bad Request** (Validation Error):
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
    "location": {
      "city": "San Francisco",
      "country": "USA"
    },
    "skills": ["React", "Node.js"],
    "sector": "Technology",
    "experienceLevel": "SENIOR",
    "deadline": "2025-10-17T00:00:00Z"
  }
  ```

### 4. Update Job
Update an existing job by its ID.

- **Method**: PUT
- **Path**: `/jobs/:id`
- **Authentication**: Required (role: `admin` or `employer`)
- **Parameters**:
  - `id` (path, string): The ID of the job to update.
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "jobType": "string (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE)",
    "jobSite": "string (ONSITE, REMOTE, HYBRID)",
    "location": {
      "city": "string",
      "country": "string"
    },
    "skills": ["string"],
    "sector": "string",
    "experienceLevel": "string (JUNIOR, MID, SENIOR)",
    "deadline": "string (ISO 8601)",
    "status": "string (OPEN, CLOSED)"
  }
  ```
- **Validation Rules** (enforced by `createJobValidator` and `jobSchema`):
  - Same as `POST /jobs` for provided fields.
  - `deadline`: If provided, must be a valid ISO 8601 date in the future.
  - `status`: If provided, must be one of `OPEN`, `CLOSED`.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Job updated successfully",
      "job": {
        "_id": "string",
        "title": "string",
        "description": "string",
        "jobType": "string",
        "jobSite": "string",
        "location": {
          "city": "string",
          "country": "string"
        },
        "skills": ["string"],
        "sector": "string",
        "experienceLevel": "string",
        "deadline": "string (ISO 8601)",
        "createdBy": {
          "_id": "string",
          "name": "string",
          "email": "string"
        },
        "status": "string",
        "createdAt": "string (ISO 8601)",
        "updatedAt": "string (ISO 8601)"
      }
    }
    ```
  - **400 Bad Request** (Invalid ID or Validation Error):
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
    "description": "Updated description for web application development.",
    "deadline": "2025-11-01T00:00:00Z"
  }
  ```

### 5. Delete Job
Delete a job by its ID.

- **Method**: DELETE
- **Path**: `/jobs/:id`
- **Authentication**: Required (role: `admin` or `employer`)
- **Parameters**:
  - `id` (path, string): The ID of the job to delete.
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Job deleted successfully" }
    ```
  - **400 Bad Request** (Invalid ID):
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

### 6. Get Jobs by User
Retrieve jobs created by a specific user with pagination.

- **Method**: GET
- **Path**: `/jobs/user/:userId`
- **Authentication**: Required (role: `admin` or `employer`)
- **Parameters**:
  - `userId` (path, string): The ID of the user whose jobs to retrieve.
- **Query Parameters**:
  - `page` (optional, number, default: 1): Page number for pagination.
  - `limit` (optional, number, default: 10): Number of jobs per page.
  - `status` (optional, string): Filter by job status (`OPEN`, `CLOSED`) (currently commented out in controller but supported by schema).
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
          "location": {
            "city": "string",
            "country": "string"
          },
          "skills": ["string"],
          "sector": "string",
          "experienceLevel": "string",
          "deadline": "string (ISO 8601)",
          "createdBy": {
            "_id": "string",
            "name": "string",
            "email": "string"
          },
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
  - **400 Bad Request** (Invalid ID):
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

## Notes
- **Validation Middleware**: The `validate.js` middleware uses `express-validator` to check request bodies for `POST /jobs` and `PUT /jobs/:id`. Validation errors are returned as a single string with messages joined by commas.
- **Date Format**: All dates (e.g., `deadline`, `createdAt`, `updatedAt`) are in ISO 8601 format (e.g., `2025-10-17T00:00:00Z`).
- **Populated Fields**: The `createdBy` field in responses is populated with the user’s `name` and `email`.
- **Status Filter**: The `status` query parameter for `GET /jobs/user/:userId` is commented out in the controller but included in the schema. To enable it, uncomment the line `if (status) filter.status = status;` in the `getJobsByUser` controller.
- **Error Handling**: In addition to validation errors, Mongoose schema validation may trigger errors (e.g., for invalid enum values or past deadlines) in `POST` and `PUT` endpoints, which are also returned as `400 Bad Request` with detailed messages.
- **Assumption**: The `createJobValidator` is assumed to enforce the `jobSchema` constraints, such as required fields, string lengths, enum values, and future deadline validation.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── index.js
│   │   ├── talents.js
│   │   └── users.js
│   ├── app.js
│   └── server.js
├── .gitignore
├── env.example
├── package.json
└── README.md
```

## Development

This project uses:
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **dotenv** - Environment variable management
- **Nodemon** - Development server with auto-restart

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the ISC License.
