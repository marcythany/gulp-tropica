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
		// Inicializando o usuário do localStorage
		const storedUser = getUser();
		if (storedUser) {
			setUser(storedUser);
		}
		setLoading(false);
	}, []);

	const login = async (email, password) => {
		try {
			const response = await loginService({ email, password });
			const { user, token } = response;

			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('userToken', token);
			setUser(user);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.message || 'Erro ao fazer login',
			};
		}
	};

	const register = async (userData) => {
		try {
			const response = await registerService(userData);
			const { user, token } = response;

			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('userToken', token);
			setUser(user);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.message || 'Erro ao registrar',
			};
		}
	};

	const updateUserProfile = async (userData) => {
		try {
			const updatedUser = await updateProfile(userData);
			localStorage.setItem('user', JSON.stringify(updatedUser));
			setUser(updatedUser);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.message || 'Erro ao atualizar perfil',
			};
		}
	};

	const logout = () => {
		logoutService();
		setUser(null);
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
