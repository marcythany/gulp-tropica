import React, { createContext, useState, useEffect } from 'react';
import {
	loginUser,
	registerUser,
	updateProfile,
} from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		const storedToken = localStorage.getItem('token');

		if (storedUser && storedToken) {
			setUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);

	const login = async (email, password) => {
		try {
			const response = await loginUser(email, password);
			const { user, token } = response;

			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('token', token);
			setUser(user);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.response?.data?.message || 'Erro ao fazer login',
			};
		}
	};

	const register = async (userData) => {
		try {
			const response = await registerUser(userData);
			const { user, token } = response;

			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('token', token);
			setUser(user);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error.response?.data?.message || 'Erro ao registrar',
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
				error: error.response?.data?.message || 'Erro ao atualizar perfil',
			};
		}
	};

	const logout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
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
