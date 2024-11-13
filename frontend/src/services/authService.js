import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Função para registro de novo usuário
export const register = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/auth/register`, userData);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data) {
			console.error('Erro ao registrar:', error.response.data);
			throw new Error(error.response.data.message || 'Erro ao registrar');
		} else {
			console.error('Erro de rede ou servidor não responde');
			throw new Error('Erro ao registrar: Rede ou servidor não responde');
		}
	}
};

// Função para login de usuário
export const login = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/auth/login`, userData);
		if (response.data.token) {
			localStorage.setItem('userToken', response.data.token);
		}
		return response.data;
	} catch (error) {
		if (error.response && error.response.data) {
			console.error('Erro ao fazer login:', error.response.data);
			throw new Error(error.response.data.message || 'Erro ao fazer login');
		} else {
			console.error('Erro de rede ou servidor não responde');
			throw new Error('Erro ao fazer login: Rede ou servidor não responde');
		}
	}
};

// Função para logout do usuário
export const logout = () => {
	localStorage.removeItem('userToken');
	localStorage.removeItem('user');
};

// Função para obter o token do usuário autenticado
export const getToken = () => {
	return localStorage.getItem('userToken');
};

// Função para atualizar o perfil do usuário
export const updateProfile = async (userData) => {
	try {
		const token = getToken();
		const response = await axios.put(`${API_URL}/profile`, userData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response && error.response.data) {
			console.error('Erro ao atualizar perfil:', error.response.data);
			throw new Error(
				error.response.data.message || 'Erro ao atualizar perfil'
			);
		} else {
			console.error('Erro de rede ou servidor não responde');
			throw new Error(
				'Erro ao atualizar perfil: Rede ou servidor não responde'
			);
		}
	}
};

// Função para obter dados do usuário logado
export const getUser = () => {
	const user = localStorage.getItem('user');
	return user ? JSON.parse(user) : null;
};
