import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
	baseURL: `${API_URL}`,
	timeout: 5000,
});

// Função para verificar se o token é válido
const getToken = () => {
	const token = localStorage.getItem('userToken');
	if (!token) {
		throw new Error('Token não encontrado. Por favor, faça login.');
	}
	console.log('Token encontrado:', token); // Log para depuração
	return token;
};

// Função para buscar vídeos com base em tags
export const fetchVideos = async (tag) => {
	if (!tag) {
		throw new Error('A tag não pode ser vazia');
	}

	try {
		const response = await api.get('/api/videos', {
			params: { tag },
		});
		console.log('URL da requisição:', `${API_URL}/videos?tag=${tag}`);
		return response.data;
	} catch (error) {
		console.error('Erro ao buscar vídeos:', error.response?.data);
		throw new Error(error.response?.data?.message || 'Erro ao buscar vídeos');
	}
};

// Função para buscar vídeos com base em tags (adicionada como 'searchVideos')
export const searchVideos = async (tag) => {
	return fetchVideos(tag); // Reutilizando a função fetchVideos
};

// Função para adicionar vídeo aos favoritos
export const addToFavorites = async (videoData) => {
	try {
		// Verificar se o token está presente
		const token = getToken();
		console.log('Token enviado:', token);

		// Validar se videoData contém a propriedade videoId
		if (!videoData || !videoData.videoId) {
			throw new Error('videoData inválido: videoId é necessário.');
		}

		// Enviar a requisição com o token no cabeçalho
		const response = await api.post(
			'/videos/favorites',
			{ videoId: videoData.videoId },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		console.log('Resposta ao adicionar favorito:', response.data);
		return response.data;
	} catch (error) {
		console.error('Erro ao adicionar aos favoritos:', error.response?.data);
		throw new Error(
			error.response?.data?.message || 'Erro ao adicionar aos favoritos'
		);
	}
};

// Função para remover vídeo dos favoritos
export const removeFromFavorites = async (videoId) => {
	try {
		const token = getToken();
		console.log('Token enviado:', token);

		const response = await api.delete(`/videos/favorites/${videoId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		console.log('Resposta ao remover favorito:', response.data);
		return response.data;
	} catch (error) {
		console.error('Erro ao remover dos favoritos:', error.response?.data);
		throw new Error(
			error.response?.data?.message || 'Erro ao remover dos favoritos'
		);
	}
};

// Função para obter vídeos favoritos do usuário
export const getFavorites = async () => {
	try {
		const token = getToken();
		console.log('Token enviado:', token);

		const response = await api.get('/videos/favorites', {
			headers: { Authorization: `Bearer ${token}` },
		});

		console.log('Resposta ao obter favoritos:', response.data);
		return response.data;
	} catch (error) {
		if (error.response?.status === 404) {
			console.log('Nenhum favorito encontrado.');
			return []; // Retorna array vazio se não houver favoritos
		}
		console.error('Erro ao obter favoritos:', error.response?.data);
		throw new Error(error.response?.data?.message || 'Erro ao obter favoritos');
	}
};

export default api;
