import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Substitua pelo URL da sua API

// Função para registro de novo usuário
export const register = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/register`, userData);
		return response.data;
	} catch (error) {
		throw new Error(error.response.data.message || 'Erro ao registrar');
	}
};

// Função para login de usuário
export const login = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/login`, userData);
		// Salvando o token JWT no localStorage
		if (response.data.token) {
			localStorage.setItem('userToken', response.data.token);
		}
		return response.data;
	} catch (error) {
		throw new Error(error.response.data.message || 'Erro ao fazer login');
	}
};

// Função para logout do usuário
export const logout = () => {
	localStorage.removeItem('userToken');
};

// Função para obter o token do usuário autenticado
export const getToken = () => {
	return localStorage.getItem('userToken');
};
