import Favorite from '../models/Favorite.js';
import { getCache, setCache } from '../services/cacheService.js';
import { fetchVideos } from '../services/youtubeService.js';

const defaultTags = ['Jiafei', 'floptropica', 'cupcakke', 'Potaxie'];

export const getVideos = async (req, res) => {
	const { tag } = req.query;

	// Validação de tags
	if (tag && !/^[a-zA-Z0-9,]+$/.test(tag)) {
		return res.status(400).json({
			message: 'Tags inválidas, somente letras e números são permitidos.',
		});
	}

	const tags = tag ? tag.split(',') : defaultTags;
	const cacheKey = `videos_${tags.join('_')}`;

	try {
		// Verificar cache
		const cachedData = getCache(cacheKey);
		if (cachedData) {
			return res.json(cachedData);
		}

		// Buscar vídeos de forma otimizada e em paralelo
		const promises = tags.map(fetchVideos);
		const results = await Promise.all(promises);

		// Se vídeos forem encontrados, armazenar no cache
		const response = results.flat();
		if (response.length > 0) {
			setCache(cacheKey, response);
		}

		// Retornar os vídeos encontrados
		return res.json(response);
	} catch (error) {
		// Melhorar tratamento de erro
		console.error('Erro ao buscar vídeos:', error);
		return res
			.status(500)
			.json({ message: 'Erro ao buscar vídeos', error: error.message });
	}
};

// Função para adicionar vídeos aos favoritos
export const addFavorite = async (req, res) => {
	const { videoId, title } = req.body;
	const userId = req.user.userId; // Garantindo que o userId venha do middleware de autenticação

	// Validação de entrada
	if (!videoId || !title) {
		return res
			.status(400)
			.json({ message: 'Favoritos requerem um videoId e um título.' });
	}

	try {
		// Criação do favorito no banco
		const favorite = new Favorite({ userId, videoId, title });
		await favorite.save();

		return res
			.status(201)
			.json({ message: 'Vídeo adicionado aos favoritos com sucesso.' });
	} catch (error) {
		console.error('Erro ao adicionar vídeo aos favoritos:', error);
		return res
			.status(500)
			.json({
				message: 'Erro ao adicionar vídeo aos favoritos',
				error: error.message,
			});
	}
};

// Função para listar os vídeos favoritos
export const getFavorites = async (req, res) => {
	const userId = req.user.userId;

	try {
		// Buscar os vídeos favoritos do usuário no banco
		const favorites = await Favorite.find({ userId }).populate('videoId');
		if (favorites.length === 0) {
			return res.status(404).json({ message: 'Nenhum favorito encontrado' });
		}

		return res.json(favorites);
	} catch (error) {
		console.error('Erro ao buscar favoritos:', error);
		return res
			.status(500)
			.json({ message: 'Erro ao buscar favoritos', error: error.message });
	}
};
