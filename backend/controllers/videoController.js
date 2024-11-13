import Favorite from '../models/Favorite.js';
import { getCache, setCache } from '../services/cacheService.js';
import { fetchVideos } from '../services/youtubeService.js';

const defaultTags = ['Jiafei', 'floptropica', 'cupcakke', 'Potaxie'];

export const getVideos = async (req, res) => {
	const { tag } = req.query;
	const tags = tag ? tag.split(',') : defaultTags;
	const cacheKey = `videos_${tags.join('_')}`;

	try {
		const cachedData = getCache(cacheKey);
		if (cachedData) {
			return res.json(cachedData);
		} else {
			const promises = tags.map(fetchVideos);
			const results = await Promise.all(promises);
			const response = results.flat();
			setCache(cacheKey, response);
			res.json(response);
		}
	} catch (error) {
		res.status(500).json({ message: 'Erro ao buscar vídeos', error });
	}
};

export const addFavorite = async (req, res) => {
	const { videoId, title } = req.body;
	const userId = req.user.userId;
	try {
		const favorite = new Favorite({ userId, videoId, title });
		await favorite.save();
		res.status(201).json({ message: 'Vídeo adicionado aos favoritos' });
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Erro ao adicionar vídeo aos favoritos', error });
	}
};

export const getFavorites = async (req, res) => {
	const userId = req.user.userId;
	try {
		const favorites = await Favorite.find({ userId });
		res.json(favorites);
	} catch (error) {
		res.status(500).json({ message: 'Erro ao buscar favoritos', error });
	}
};
