import express from 'express';
import { getVideos } from '../controllers/videoController.js';
import { videoLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Rota de busca de vídeos com tags
router.get('/search', videoLimiter, async (req, res) => {
	const { tag } = req.query;

	// Validação das tags na query (permitir apenas letras, números e vírgulas)
	if (tag && !/^[a-zA-Z0-9,]+$/.test(tag)) {
		return res
			.status(400)
			.json({ message: 'Tags inválidas. Apenas letras e números.' });
	}

	try {
		// Passar a requisição e resposta para o controller getVideos
		await getVideos(req, res);
	} catch (error) {
		// Captura de erro mais detalhada
		console.error(error);
		res
			.status(500)
			.json({ message: 'Erro ao buscar vídeos', error: error.message });
	}
});

export default router;
