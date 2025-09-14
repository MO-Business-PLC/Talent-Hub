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

#### Talents
- `GET /api/talents` - Get all talents
- `GET /api/talents/:id` - Get talent by ID
- `POST /api/talents` - Create talent
- `PUT /api/talents/:id` - Update talent
- `DELETE /api/talents/:id` - Delete talent

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
