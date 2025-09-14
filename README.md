# Talent Hub Fullstack

Talent Hub is a full-stack platform for **talent management and collaboration**.  
It enables applicants to register, browse and apply for jobs, while employers can post and manage jobs, review applicants, and update application statuses. An admin module provides oversight with analytics and job/application management.

---

## Features

### Backend (Express.js + Node.js)
- RESTful API with structured routes
- JWT authentication with role-based access control
- User, Job, and Application modules
- File upload support for resumes
- Search and filtering for jobs
- Admin APIs for monitoring jobs and applications
- Secure configuration with environment variables
- Error handling and validation middleware

### Frontend (React/Next.js + Tailwind)
- Landing Page with job listings
- Applicant Dashboard (register, login, apply, view applications)
- Employer Dashboard (post jobs, manage applicants)
- Admin Dashboard (manage jobs and applications, view stats)
- Dark mode support
- Resume upload and management
- Responsive UI with consistent design from Figma
- Integration with backend APIs

### General
- End-to-end tested with Postman and manual QA
- Deployed on **Render/Heroku** (backend) and **Vercel** (frontend)
- Designed for scalability and clean developer collaboration

---

## Getting Started

### Prerequisites
- **Node.js** v14+  
- **npm** or **yarn**  
- **PostgreSQL/MongoDB** (depending on configuration)  

---

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/talent-hub.git
cd talent-hub
```
2.Install dependencies for both backend and frontend:
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Setup environment variables:
```bash
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env
```

### Running the Application

1. Backend

- Development mode:
```bash
cd backend
npm run dev
```

- Production mode: 
```bash
npm start
```

2. Frontend
- Development mode:
```bash
cd frontend
npm run dev
```

- Production mode:
```bash
npm run build && npm start
```

## Project Structure

```
talent-hub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── public/
│   ├── env.example
│   └── package.json
│
├── README.md
└── .gitignore
```

## Development
- ** Frontend ** - Next.js, React, Tailwind CSS
- ** Backend ** - Node.js, Express.js
- ** Database ** - PostgreSQL/MongoDB
- ** Authentication ** - JWT + role-based access
- ** Deployment ** - Render/Heroku (backend), Vercel (frontend)
- ** Testing ** - Postman, manual QA
- ** Design ** - Figma

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the ISC License.

