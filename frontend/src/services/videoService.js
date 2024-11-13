// videoService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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

// Função para buscar vídeos com base em tags (adicionada como 'searchVideos')
export const searchVideos = async (tag) => {
	return fetchVideos(tag); // Reutilizando a função fetchVideos
};

// Função para adicionar vídeo aos favoritos
export const addToFavorites = async (videoData) => {
	try {
		const token = localStorage.getItem('userToken');
		const response = await axios.post(`${API_URL}/favorites`, videoData, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		throw new Error(
			error.response.data.message || 'Erro ao adicionar aos favoritos'
		);
	}
};

// Função para remover vídeo dos favoritos
export const removeFromFavorites = async (videoId) => {
	try {
		const token = localStorage.getItem('userToken');
		const response = await axios.delete(`${API_URL}/favorites/${videoId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		throw new Error(
			error.response.data.message || 'Erro ao remover dos favoritos'
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
