# Markdown Editor API

A RESTful API service for creating, storing, editing, and converting markdown notes. This backend allows users to register, authenticate, and manage their markdown documents with secure storage.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Notes Management**: Create, read, update, and delete markdown notes
- **Markdown Conversion**: Convert markdown content to HTML
- **RESTful API**: Well-defined API with OpenAPI documentation
- **PostgreSQL Storage**: Persistent storage of users and notes

## Tech Stack

- **Node.js** and **TypeScript**
- **Express.js** for API routing
- **PostgreSQL** for data storage
- **JWT** for authentication
- **Marked** library for markdown parsing
- **Jest** for testing

## Prerequisites

- Node.js >= 16.0
- PostgreSQL >= 14
- npm >= 8.0

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mikamika06/markdowneditor.git
   cd markdowneditor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp .env.development.example .env.development
   cp .env.production.example .env.production
   
   # Edit the files with your configuration
   # At minimum, set JWT_SECRET and PostgreSQL connection details
   ```

4. **Create a PostgreSQL database**
   ```bash
   createdb markdowneditor
   ```

5. **Run database migrations**
   ```bash
   npm run build
   npm run migrate
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- **POST /auth/register** - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **POST /auth/login** - Login and get authentication token
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Notes

All note endpoints require authentication via JWT token in the Authorization header:
`Authorization: Bearer your_token_here`

- **GET /notes** - Get all user's notes
- **GET /notes/:id** - Get a specific note
- **POST /notes** - Create a new note
  ```json
  {
    "title": "My Note",
    "content": "# Markdown Content\n\nThis is a paragraph."
  }
  ```
- **PUT /notes/:id** - Update a note
  ```json
  {
    "title": "Updated Title",
    "content": "# Updated Content"
  }
  ```
- **DELETE /notes/:id** - Delete a note
- **GET /notes/:id/html** - Get HTML version of a note

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment to Heroku

This application is configured for easy deployment to Heroku:

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL addon**
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

3. **Configure environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secure_secret_here
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Run migrations**
   ```bash
   heroku run npm run migrate
   ```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── models/         # Data models
├── repositories/   # Data access layer
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── migrations/     # Database migrations
└── index.ts        # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Acknowledgements

- [Express](https://expressjs.com/) - Web framework
- [Marked](https://marked.js.org/) - Markdown parser
- [JWT](https://jwt.io/) - JSON Web Tokens
- [PostgreSQL](https://www.postgresql.org/) - Database
