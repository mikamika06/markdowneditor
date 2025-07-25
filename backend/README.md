# Markdown Editor API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust RESTful API backend for the Markdown Editor application. Provides secure user authentication, note management, and real-time markdown processing with persistent storage.

## 🌟 Features

- **Secure Authentication** - JWT-based user registration and login
- **Note Management** - Full CRUD operations for markdown notes
- **Markdown Processing** - Server-side markdown to HTML conversion
- **RESTful Design** - Clean, predictable API endpoints
- **Database Persistence** - PostgreSQL storage with migrations
- **OpenAPI Documentation** - Comprehensive API documentation
- **Type Safety** - Built with TypeScript for better code quality
- **Comprehensive Testing** - Unit, integration, and contract tests

## 🛠️ Tech Stack

- **Node.js 18+** with **TypeScript** for type-safe development
- **Express.js** for robust API framework
- **PostgreSQL** for reliable data persistence
- **JWT** for secure authentication tokens
- **Marked** library for markdown parsing and conversion
- **Jest** for comprehensive testing suite
- **CORS** for cross-origin resource sharing

## 🔧 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm >= 9.0.0 or yarn >= 1.22.0

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mikamika06/markdowneditor.git
   cd markdowneditor/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb markdowneditor
   
   # Or using PostgreSQL CLI
   psql -U postgres -c "CREATE DATABASE markdowneditor;"
   ```

4. **Environment configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   ```
   
   Required environment variables:
   ```env
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=markdowneditor
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_very_secure_jwt_secret_key
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Run database migrations**
   ```bash
   npm run build
   npm run migrate
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The API will be available at `http://localhost:3000`

### Production Mode
```bash
npm run build
npm start
```

### Watch Mode (with auto-restart)
```bash
npm run dev:watch
```

## 📚 API Documentation

### 🔐 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### 📝 Notes Endpoints

> **Note:** All note endpoints require authentication. Include the JWT token in the Authorization header:
> ```
> Authorization: Bearer your_jwt_token_here
> ```

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer {token}
```

#### Get Specific Note
```http
GET /api/notes/:id
Authorization: Bearer {token}
```

#### Create Note
```http
POST /api/notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My First Note",
  "content": "# Welcome\n\nThis is my **first** markdown note!"
}
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Note Title",
  "content": "# Updated Content\n\nThis note has been updated."
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer {token}
```

#### Get Note as HTML
```http
GET /api/notes/:id/html
Authorization: Bearer {token}
```

**Response:**
```json
{
  "html": "<h1>Welcome</h1><p>This is my <strong>first</strong> markdown note!</p>"
}
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Suites
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Contract tests only
npm run test:contract
```

### Test Types
- **Unit Tests** - Test individual functions and components
- **Integration Tests** - Test API endpoints and database interactions
- **Contract Tests** - Test API contract compliance

## 🚀 Production Deployment

### Deploy to Heroku

1. **Create Heroku application**
   ```bash
   heroku create your-markdown-api
   ```

2. **Add PostgreSQL addon**
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

3. **Configure environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_super_secure_secret_key_here
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
   ```

4. **Deploy the application**
   ```bash
   git push heroku main
   ```

5. **Run database migrations**
   ```bash
   heroku run npm run migrate
   ```

6. **Verify deployment**
   ```bash
   heroku logs --tail
   ```

### Environment Variables for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Heroku sets this) | `3000` |
| `DATABASE_URL` | PostgreSQL connection (Heroku sets this) | `postgresql://user:pass@host:port/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-256-bit-secret` |
| `CORS_ORIGIN` | Allowed frontend origins | `https://yourapp.vercel.app` |

## 📁 Project Structure

```
src/
├── api/                # OpenAPI specification
│   └── openapi.yaml
├── config/             # Configuration files
│   └── database.ts     # Database connection setup
├── controllers/        # Request handlers and business logic
│   ├── auth.controller.ts
│   └── notes.controller.ts
├── middleware/         # Express middleware functions
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── migrations/         # Database schema migrations
│   ├── 001_initial_schema.ts
│   └── runner.ts
├── models/             # Data models and interfaces
│   ├── note.model.ts
│   └── user.model.ts
├── repositories/       # Data access layer
│   ├── interfaces/     # Repository interfaces
│   ├── pg/            # PostgreSQL implementations
│   └── repository-factory.ts
├── routes/             # API route definitions
│   ├── auth.routes.ts
│   └── notes.routes.ts
├── services/           # Business logic services
│   ├── auth.service.ts
│   └── notes.service.ts
├── types/              # TypeScript type definitions
│   └── index.d.ts
├── utils/              # Utility functions
│   └── markdown.ts
└── index.ts            # Application entry point
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run all test suites |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run test:contract` | Run contract tests only |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run migrate` | Run database migrations |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |

## 🏗️ Architecture

The backend follows a layered architecture pattern:

- **Controllers** - Handle HTTP requests and responses
- **Services** - Contain business logic and validation
- **Repositories** - Abstract data access operations
- **Models** - Define data structures and relationships
- **Middleware** - Handle cross-cutting concerns (auth, errors, CORS)
- **Routes** - Define API endpoints and their handlers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow TypeScript best practices
- Use meaningful commit messages
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

**Database Connection Errors**
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

**JWT Token Issues**
- Ensure `JWT_SECRET` is set in environment
- Check token expiration settings
- Verify token format in requests

**CORS Errors**
- Check `CORS_ORIGIN` configuration
- Ensure frontend URL matches exactly

### Getting Help

- Check existing [Issues](https://github.com/mikamika06/markdowneditor/issues)
- Create a new issue with detailed information
- Include error logs and environment details
