import React, { createContext, useState, useEffect } from 'react';
import {
	login as loginService,
	register as registerService,
	updateProfile,
	getUser,
	logout as logoutService,
} from '../services/authService';

// Contexto de autenticação
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Recuperar o usuário do localStorage ao inicializar
	useEffect(() => {
		const storedUser = getUser();
		if (storedUser) {
			setUser(storedUser);
		}
		setLoading(false); // Termina o carregamento
	}, []);

	// Função para login
	const login = async (email, password) => {
		setLoading(true); // Indica que está carregando durante o login
		try {
			const response = await loginService({ email, password });
			const { user, token } = response;

			// Salva as informações no localStorage e atualiza o estado
			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('userToken', token);
			setUser(user);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.message || 'Erro ao fazer login',
			};
		} finally {
			setLoading(false); // Finaliza o carregamento
		}
	};

	// Função para registro
	const register = async (userData) => {
		setLoading(true); // Indica que está carregando durante o registro
		try {
			const response = await registerService(userData);
			const { user, token } = response;

			// Salva as informações no localStorage e atualiza o estado
			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('userToken', token);
			setUser(user);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.message || 'Erro ao registrar',
			};
		} finally {
			setLoading(false); // Finaliza o carregamento
		}
	};

	// Função para atualizar o perfil do usuário
	const updateUserProfile = async (userData) => {
		setLoading(true); // Indica que está carregando durante a atualização
		try {
			const updatedUser = await updateProfile(userData);

			// Atualiza o perfil no localStorage e no estado
			localStorage.setItem('user', JSON.stringify(updatedUser));
			setUser(updatedUser);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.message || 'Erro ao atualizar perfil',
			};
		} finally {
			setLoading(false); // Finaliza o carregamento
		}
	};

	// Função para logout
	const logout = () => {
		logoutService();
		setUser(null); // Remove o usuário do estado
		localStorage.removeItem('user'); // Limpa as informações do localStorage
		localStorage.removeItem('userToken');
	};

	// Valor do contexto
	const value = {
		user,
		loading,
		login,
		register,
		logout,
		updateUserProfile,
	};

	// Se estiver carregando, mostra a tela de loading
	if (loading) {
		return <div>Carregando...</div>;
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
