import axios from 'axios';

const fetchVideos = async (query) => {
	try {
		const response = await axios.get(
			'https://www.googleapis.com/youtube/v3/search',
			{
				params: {
					part: 'snippet',
					q: query,
					key: process.env.YOUTUBE_API_KEY,
				},
			}
		);
		return response.data.items; // Retornando apenas os itens para facilitar o tratamento
	} catch (error) {
		console.error('Erro ao buscar vídeos no YouTube:', error);
		throw error;
	}
};

export { fetchVideos };
