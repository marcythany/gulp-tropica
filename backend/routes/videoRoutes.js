import express from 'express';
import { addFavorite, getFavorites } from '../controllers/videoController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rota para adicionar aos favoritos
router.post('/favorites', authMiddleware, async (req, res) => {
	const { videoId, title } = req.body;
	if (!videoId || !title) {
		return res
			.status(400)
			.json({ message: 'Favoritos requerem um videoId e um título.' });
	}

	try {
		await addFavorite(req, res);
		res
			.status(201)
			.json({ message: 'Vídeo adicionado aos favoritos com sucesso.' });
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Erro ao adicionar vídeo aos favoritos', error });
	}
});

// Rota para obter vídeos favoritos
router.get('/favorites', authMiddleware, async (req, res) => {
	try {
		const favorites = await getFavorites(req, res);
		if (favorites.length === 0) {
			return res
				.status(404)
				.json({ message: 'Nenhum vídeo favorito encontrado.' });
		}
		res.json(favorites);
	} catch (error) {
		res.status(500).json({ message: 'Erro ao buscar favoritos', error });
	}
});

export default router;
