import express from 'express';
import { getVideos } from '../controllers/videoController.js'; // Importando o controlador que você já tem

const router = express.Router();

// Rota para buscar vídeos com base em tags
router.get('/', getVideos);

export default router;
