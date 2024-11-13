import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import cors from 'cors';

// Configura as variáveis de ambiente
dotenv.config();

// Conecta ao banco de dados
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsing de JSON
app.use(express.json());

// Configuração do CORS
app.use(
	cors({
		origin: 'http://localhost:3000', // Permite requisições do frontend
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP necessários
	})
);

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', searchRoutes);

// Início do servidor
app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});
