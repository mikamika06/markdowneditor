import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import notesRoutes from './routes/notes.routes';
import authRoutes from './routes/auth.routes'
import { verifyToken } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';
import { testConnection } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: [
    'https://markdown-editor-app-9d1216444045.herokuapp.com',
    'http://localhost:5173',
    'https://markdowneditor-gold.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
  res.send('Markdown Editor API is running!');
});

app.use('/auth', authRoutes);
app.use('/notes', verifyToken, notesRoutes);
app.use(errorHandler);

async function startServer() {
  try {
    const connected = await testConnection();
    if (!connected) {
      console.error("Failed to connect to the database. Exiting.");
      process.exit(1);
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
