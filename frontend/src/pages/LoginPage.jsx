import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
	const [isLogin, setIsLogin] = useState(true);
	const { login, register } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState('');

	const handleSubmit = async (values, { setSubmitting }) => {
		setError('');
		try {
			let result;
			if (isLogin) {
				result = await login(values.email, values.password);
			} else {
				result = await register({
					name: values.name,
					email: values.email,
					password: values.password,
				});
			}

			if (result.success) {
				navigate('/');
			} else {
				setError(result.error);
			}
		} catch (err) {
			setError('Ocorreu um erro. Tente novamente.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className='max-w-md mx-auto bg-white rounded-lg shadow-lg p-8'>
			<h2 className='text-2xl font-bold mb-6 text-center'>
				{isLogin ? 'Login' : 'Registro'}
			</h2>

			{error && (
				<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
					{error}
				</div>
			)}

			<LoginForm
				isLogin={isLogin}
				onSubmit={handleSubmit}
				toggleForm={() => setIsLogin(!isLogin)}
			/>
		</div>
	);
};

export default LoginPage;
