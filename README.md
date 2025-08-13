

# Markdown Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fully functional web application for creating, storing, and editing Markdown documents with HTML preview and auto-saving.

## 🌟 Key Features

- **User Authentication**: Registration and login
- **Note Management**: Create, edit, delete, and view notes
- **Markdown Editor**: Syntax highlighting and HTML conversion
- **Auto-Save**: Automatically saves changes
- **Responsive Design**: User-friendly interface across devices

## 🛠️ Technologies

### Backendd
- Node.js + TypeScript
- Express.js
- PostgreSQL
- JWT for authentication
- Marked for Markdown to HTML conversion

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand for state management
- CodeMirror for code editing

## 🚀 Quick Start

### Requirementss
- Node.js 16+
- PostgreSQL 14+
- npm 8+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mikamika06/markdowneditor.git
   cd markdowneditor
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   - For backend: create `.env` in `backend/` and configure:
     ```env
     DATABASE_URL=your_postgresql_connection_string
     JWT_SECRET=your_jwt_secret
     ```
   - For frontend: create `.env` in `frontend/` and configure:
     ```env
     VITE_API_URL=http://localhost:3000
     ```

4. **Run database migrations**
   ```bash
   cd backend
   npm run build
   npm run migrate
   ```

5. **Start the development servers**
   - Backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Frontend (in a separate terminal):
     ```bash
     cd frontend
     npm run dev
     ```

6. **Access the application**
   - Open your browser and go to `http://localhost:5173`

## 🌐 Deployment

- **Backend**: Deploy to Heroku
  - Add your Heroku app as a remote:
    ```bash
    heroku git:remote -a your-heroku-app-name
    ```
  - Deploy:
    ```bash
    git subtree push --prefix backend heroku main
    ```
  - Run migrations:
    ```bash
    heroku run npm run migrate
    ```

- **Frontend**: Deploy to Vercel or Netlify
  - For Vercel: Import your repo, set root directory to `frontend`, add `VITE_API_URL` env variable.
  - For Netlify: Set build command to `npm run build` and publish directory to `dist` in `frontend`.

## 📁 Project Structure

```
markdowneditor/
├── backend/         # Backend (Node.js, Express)
├── frontend/        # Frontend (React, Vite)
├── LICENSE          # MIT License
└── README.md        # This file
```

## 🧪 Testing

### Backend
```bash
cd backend
npm test
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

6. **Access the application**

   Open your browser and navigate to `http://localhost:3000`.

   ```

   ```
