import { fetchVideos } from '../services/youtubeService.js';
import { getCache, setCache } from '../services/cacheService.js';

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
