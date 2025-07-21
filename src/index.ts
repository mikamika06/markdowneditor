import express from 'express';
import dotenv from 'dotenv';
import notesRoutes from './routes/notes.routes';
import authRoutes from './routes/auth.routes'
import { verifyToken } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Markdown Editor API is running!');
});

app.use('/auth', authRoutes);

app.use('/notes', verifyToken, notesRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on adress http://localhost:${PORT}`);
});
