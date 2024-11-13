import { Favorite } from '../models/favoriteModels.js';

// Adiciona um vídeo aos favoritos
export const addToFavorites = async (videoData) => {
	try {
		// Verificar se o token está presente
		const token = localStorage.getItem('userToken');
		console.log('Token:', token);

		if (!token) {
			throw new Error('Token não encontrado. Por favor, faça login.');
		}

		// Validar se videoData contém a propriedade videoId e título
		if (!videoData || !videoData.videoId || !videoData.title) {
			throw new Error('videoData inválido: videoId e título são necessários.');
		}

		// Enviar a requisição com o token no cabeçalho
		const response = await api.post('/videos/favorites', videoData, {
			headers: { Authorization: `Bearer ${token}` }, // Enviando o token no cabeçalho
		});

		return response.data;
	} catch (error) {
		console.error('Erro ao adicionar aos favoritos:', error);

		// Tratar erros de rede ou falhas na resposta
		const errorMessage =
			error.response?.data?.message ||
			error.message ||
			'Erro ao adicionar aos favoritos';

		// Lançar um erro mais descritivo
		throw new Error(errorMessage);
	}
};

// Remove um vídeo dos favoritos
export const removeFavorite = async (req, res) => {
	const { videoId } = req.params;
	const userId = req.user.id;

	try {
		const deletedFavorite = await Favorite.findOneAndDelete({
			userId,
			videoId,
		});
		if (!deletedFavorite) {
			return res.status(404).json({ message: 'Favorito não encontrado' });
		}

		res.status(200).json({ message: 'Vídeo removido dos favoritos' });
	} catch (error) {
		res.status(500).json({ message: 'Erro ao remover dos favoritos', error });
	}
};

// Obtém todos os vídeos favoritos do usuário
export const getFavorites = async (req, res) => {
	const userId = req.user.id;

	try {
		const favorites = await Favorite.find({ userId }).populate('videoId');
		res.status(200).json(favorites);
	} catch (error) {
		res.status(500).json({ message: 'Erro ao obter favoritos', error });
	}
};
