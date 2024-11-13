import React, { createContext, useState, useEffect } from 'react';
import {
	login as loginService,
	register as registerService,
	updateProfile,
	getUser,
	logout as logoutService,
} from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedUser = getUser();
		if (storedUser) {
			setUser(storedUser);
		} else {
			console.warn('Nenhum usuário encontrado ao carregar do localStorage');
		}
		setLoading(false);
	}, []);

	const login = async (email, password) => {
		setLoading(true); // Indica que está carregando durante o login
		try {
			const response = await loginService({ email, password });
			const { user, token } = response;

			// Verifique se a resposta contém os dados do usuário
			if (user && token) {
				// Salva as informações no localStorage e atualiza o estado
				localStorage.setItem('user', JSON.stringify(user));
				localStorage.setItem('userToken', token);
				setUser(user);
			} else {
				throw new Error('Resposta do servidor inválida');
			}

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

	const register = async (userData) => {
		setLoading(true);
		try {
			const response = await registerService(userData);
			const { user, token } = response;

			if (user && token) {
				localStorage.setItem('user', JSON.stringify(user));
				localStorage.setItem('userToken', token);
				setUser(user);
				return { success: true };
			} else {
				throw new Error('Usuário ou token inválido');
			}
		} catch (error) {
			console.error('Erro ao registrar:', error);
			return {
				success: false,
				error: error.message || 'Erro ao registrar',
			};
		} finally {
			setLoading(false);
		}
	};

	const updateUserProfile = async (userData) => {
		setLoading(true);
		try {
			const { user, token } = await updateProfile(userData);

			if (user) {
				localStorage.setItem('user', JSON.stringify(user));
				setUser(user);

				if (token) {
					localStorage.setItem('userToken', token); // Atualizar o token
				}

				return { success: true };
			} else {
				throw new Error('Erro ao atualizar perfil');
			}
		} catch (error) {
			console.error('Erro ao atualizar perfil:', error);
			return {
				success: false,
				error: error.message || 'Erro ao atualizar perfil',
			};
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		logoutService();
		setUser(null);
		localStorage.removeItem('user');
		localStorage.removeItem('userToken');
	};

	const value = {
		user,
		loading,
		login,
		register,
		logout,
		updateUserProfile,
	};

	if (loading) {
		return <div>Carregando...</div>;
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
