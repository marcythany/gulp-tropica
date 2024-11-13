import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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
		throw new Error(error.response.data.message || 'Erro ao atualizar perfil');
	}
};

// Função para obter dados do usuário logado
export const getUser = () => {
	const user = localStorage.getItem('user');
	return user ? JSON.parse(user) : null;
};
