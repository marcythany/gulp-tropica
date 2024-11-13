import express from 'express';
import { Favorite } from '../models/Video';
import { verifyToken } from '../middlewares/authMiddleware'; // Middleware de autenticação

const router = express.Router();

// Adicionar vídeo aos favoritos
router.post('/favorites', verifyToken, async (req, res) => {
	const { videoId } = req.body;
	const userId = req.user.id; // Assumindo que o middleware de autenticação adiciona o ID do usuário no request

	try {
		// Verifica se o vídeo já está nos favoritos do usuário
		const existingFavorite = await Favorite.findOne({ userId, videoId });
		if (existingFavorite) {
			return res.status(400).json({ message: 'Vídeo já está nos favoritos' });
		}

		// Cria um novo favorito
		const favorite = new Favorite({ userId, videoId });
		await favorite.save();
		return res.status(201).json(favorite);
	} catch (error) {
		return res.status(500).json({ message: 'Erro ao adicionar aos favoritos' });
	}
});

// Remover vídeo dos favoritos
router.delete('/favorites/:videoId', verifyToken, async (req, res) => {
	const { videoId } = req.params;
	const userId = req.user.id;

	try {
		// Remove o vídeo dos favoritos do usuário
		const deletedFavorite = await Favorite.findOneAndDelete({
			userId,
			videoId,
		});
		if (!deletedFavorite) {
			return res.status(404).json({ message: 'Favorito não encontrado' });
		}

		return res.status(200).json({ message: 'Vídeo removido dos favoritos' });
	} catch (error) {
		return res.status(500).json({ message: 'Erro ao remover dos favoritos' });
	}
});

// Obter todos os vídeos favoritos do usuário
router.get('/favorites', verifyToken, async (req, res) => {
	const userId = req.user.id;

	try {
		// Busca todos os favoritos do usuário
		const favorites = await Favorite.find({ userId }).populate('videoId');
		return res.status(200).json(favorites);
	} catch (error) {
		return res.status(500).json({ message: 'Erro ao obter favoritos' });
	}
});

export default router;
