import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Função unificada para tratamento de erros
const handleError = (error, defaultMessage) => {
	if (error.response && error.response.data) {
		console.error(defaultMessage, error.response.data);
		throw new Error(error.response.data.message || defaultMessage);
	} else {
		console.error('Erro de rede ou servidor não está respondendo');
		throw new Error(
			`${defaultMessage}: Erro de rede ou servidor não está respondendo`
		);
	}
};

// Função para registrar um novo usuário
export const register = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/auth/register`, userData);
		return response.data;
	} catch (error) {
		handleError(error, 'Erro ao registrar usuário');
	}
};

// Função para login do usuário
export const login = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/auth/login`, userData);
		if (response.data.token) {
			localStorage.setItem('userToken', response.data.token);
			localStorage.setItem('user', JSON.stringify(response.data.user)); // Armazena o usuário no localStorage
		}
		return response.data;
	} catch (error) {
		handleError(error, 'Erro ao fazer login');
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
		const { user, token: newToken } = response.data;
		if (newToken) {
			localStorage.setItem('userToken', newToken); // Armazenar o novo token
		}
		return { user, token: newToken };
	} catch (error) {
		handleError(error, 'Erro ao atualizar perfil');
	}
};

// Função para obter os dados do usuário logado
export const getUser = () => {
	try {
		const user = localStorage.getItem('user');

		if (user !== null) {
			const parsedUser = JSON.parse(user);

			// Verifica a estrutura esperada do usuário
			if (parsedUser && typeof parsedUser === 'object' && parsedUser._id) {
				// Certifique-se de que _id está sendo usado
				return parsedUser;
			} else {
				console.warn('Dados inválidos encontrados no localStorage');
				localStorage.removeItem('user');
				return null;
			}
		} else {
			console.warn('Nenhum usuário encontrado no localStorage');
			return null;
		}
	} catch (error) {
		console.error('Erro ao recuperar os dados do usuário:', error);
		localStorage.removeItem('user');
		return null;
	}
};
