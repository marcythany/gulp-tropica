import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// Configura as variáveis de ambiente
dotenv.config();

// Conecta ao banco de dados
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsing de JSON
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/profile', profileRoutes);

// Início do servidor
app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});
