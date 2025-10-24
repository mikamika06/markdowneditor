# Markdown Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful full-stack web application for creating, storing, and editing Markdown documents with real-time HTML preview, AI assistance, and auto-saving capabilities.

## 🌟 Key Features

- **User Authentication**: Secure registration and login system
- **Note Management**: Create, edit, delete, and organize notes efficiently
- **Markdown Editor**: Advanced syntax highlighting and real-time HTML conversion
- **AI Integration**: AI-powered writing assistance and content enhancement
- **Auto-Save**: Automatic saving of changes to prevent data loss
- **Responsive Design**: Optimized interface for desktop and mobile devices
- **Real-time Preview**: Live preview of Markdown rendering

## 🛠️ Technologies

### Backend (Node.js/TypeScript)

- Node.js + TypeScript
- Express.js web framework
- PostgreSQL database
- JWT authentication
- Marked for Markdown to HTML conversion

### AI Backend (Python/FastAPI)

- Python + FastAPI
- SQLAlchemy ORM
- AI/ML integration capabilities
- RESTful API design

### Frontend (React/TypeScript)

- React + TypeScript
- Vite build tool
- Tailwind CSS for styling
- React Query for data fetching
- Zustand for state management
- CodeMirror for advanced code editing

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Python 3.8+
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
   # Backend (Node.js)
   cd backend
   npm install

   # Frontend (React)
   cd ../frontend
   npm install

   # AI Backend (Python)
   cd ../ai-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   - **Backend**: Create `.env` in `backend/` directory:
     ```env
     DATABASE_URL=your_postgresql_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=3000
     ```
   - **Frontend**: Create `.env` in `frontend/` directory:
     ```env
     VITE_API_URL=http://localhost:3000
     VITE_AI_API_URL=http://localhost:8000
     ```
   - **AI Backend**: Create `.env` in `ai-backend/` directory:
     ```env
     DATABASE_URL=sqlite:///./markdown_editor.db
     SECRET_KEY=your_secret_key
     ```

4. **Run database migrations**

   ```bash
   cd backend
   npm run build
   npm run migrate
   ```

5. **Start the development servers**

   **Terminal 1 - Backend (Node.js):**

   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - AI Backend (Python):**

   ```bash
   cd ai-backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   PYTHONPATH=/path/to/ai-backend uvicorn main:app --reload --port 8000
   ```

   **Terminal 3 - Frontend (React):**

   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`
   - AI Backend API: `http://localhost:8000`

## 🌐 Deployment

### Backend Deployment (Heroku)

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

### AI Backend Deployment

- Deploy to platforms like Railway, Render, or AWS
- Ensure Python environment and dependencies are properly configured
- Set environment variables for production

### Frontend Deployment

- **Vercel**: Import your repository, set root directory to `frontend`, add environment variables
- **Netlify**: Set build command to `npm run build` and publish directory to `dist` in `frontend`
- **Cloudflare Pages**: Similar configuration to Netlify

## 📁 Project Structure

```
markdowneditor/
├── backend/         # Node.js/Express API server
├── ai-backend/      # Python/FastAPI AI service
├── frontend/        # React/TypeScript client
├── LICENSE          # MIT License
└── README.md        # Project documentation
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
npm run test:coverage
```

### AI Backend Testing

```bash
cd ai-backend
source venv/bin/activate
python -m pytest tests/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🔧 Development Notes

- The application consists of three main services that work together
- Backend (Node.js) handles user authentication and note management
- AI Backend (Python) provides AI-powered features and enhancements
- Frontend (React) offers an intuitive user interface
- All services communicate via RESTful APIs
