import axios from 'axios';

const API_URL = 'http://localhost:5000/api/videos'; // Substitua pelo URL da sua API

// Função para buscar vídeos com base em tags
export const fetchVideos = async (tag) => {
	try {
		const response = await axios.get(`${API_URL}/search`, {
			params: { tag },
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response.data.message || 'Erro ao buscar vídeos');
	}
};

// Função para adicionar vídeo aos favoritos
export const addFavorite = async (videoId) => {
	try {
		const token = localStorage.getItem('userToken');
		const response = await axios.post(
			`${API_URL}/favorites`,
			{ videoId },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return response.data;
	} catch (error) {
		throw new Error(
			error.response.data.message || 'Erro ao adicionar aos favoritos'
		);
	}
};

// Função para obter vídeos favoritos do usuário
export const getFavorites = async () => {
	try {
		const token = localStorage.getItem('userToken');
		const response = await axios.get(`${API_URL}/favorites`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response.data.message || 'Erro ao obter favoritos');
	}
};
