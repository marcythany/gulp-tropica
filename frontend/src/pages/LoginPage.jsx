import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import useAuth from '../hooks/useAuth';

// Schema de validação para login
const loginSchema = Yup.object().shape({
	email: Yup.string().email('Email inválido').required('Email é obrigatório'),
	password: Yup.string()
		.min(6, 'Senha deve ter pelo menos 6 caracteres')
		.required('Senha é obrigatória'),
});

// Schema de validação para registro
const registerSchema = Yup.object().shape({
	name: Yup.string().required('Nome é obrigatório'),
	email: Yup.string().email('Email inválido').required('Email é obrigatório'),
	password: Yup.string()
		.min(6, 'Senha deve ter pelo menos 6 caracteres')
		.required('Senha é obrigatória'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password'), null], 'Senhas devem ser iguais')
		.required('Confirmação de senha é obrigatória'),
});

const LoginPage = () => {
	const [isLogin, setIsLogin] = useState(true); // Controle do estado de login/registro
	const { login, register } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState(''); // Para gerenciar erros globais

	const handleSubmit = async (values, { setSubmitting }) => {
		setError(''); // Limpa erro anterior ao submeter
		try {
			let result;
			// Realiza login ou registro dependendo do estado
			if (isLogin) {
				result = await login(values.email, values.password);
			} else {
				result = await register({
					name: values.name,
					email: values.email,
					password: values.password,
				});
			}

			// Se a operação for bem-sucedida, navega para a home
			if (result.success) {
				navigate('/');
			} else {
				setError(result.error); // Exibe erro no caso de falha
			}
		} catch (err) {
			setError('Ocorreu um erro. Tente novamente.');
		} finally {
			setSubmitting(false); // Finaliza a submissão do formulário
		}
	};

	return (
		<div className='max-w-md mx-auto bg-white rounded-lg shadow-lg p-8'>
			<h2 className='text-2xl font-bold mb-6 text-center'>
				{isLogin ? 'Login' : 'Registro'}
			</h2>

			{/* Exibe erro global caso exista */}
			{error && (
				<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
					{error}
				</div>
			)}

			<Formik
				initialValues={
					isLogin
						? { email: '', password: '' }
						: { name: '', email: '', password: '', confirmPassword: '' }
				}
				validationSchema={isLogin ? loginSchema : registerSchema}
				onSubmit={handleSubmit}
			>
				{({ errors, touched, isSubmitting }) => (
					<Form className='space-y-4'>
						{/* Campo de nome (apenas no registro) */}
						{!isLogin && (
							<div>
								<Field
									name='name'
									type='text'
									placeholder='Nome'
									className='w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
								/>
								{errors.name && touched.name && (
									<div className='text-red-500 text-sm mt-1'>{errors.name}</div>
								)}
							</div>
						)}

						{/* Campo de email */}
						<div>
							<Field
								name='email'
								type='email'
								placeholder='Email'
								className='w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
							/>
							{errors.email && touched.email && (
								<div className='text-red-500 text-sm mt-1'>{errors.email}</div>
							)}
						</div>

						{/* Campo de senha */}
						<div>
							<Field
								name='password'
								type='password'
								placeholder='Senha'
								className='w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
							/>
							{errors.password && touched.password && (
								<div className='text-red-500 text-sm mt-1'>
									{errors.password}
								</div>
							)}
						</div>

						{/* Campo de confirmação de senha (apenas no registro) */}
						{!isLogin && (
							<div>
								<Field
									name='confirmPassword'
									type='password'
									placeholder='Confirmar Senha'
									className='w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
								/>
								{errors.confirmPassword && touched.confirmPassword && (
									<div className='text-red-500 text-sm mt-1'>
										{errors.confirmPassword}
									</div>
								)}
							</div>
						)}

						{/* Botão de submit */}
						<button
							type='submit'
							disabled={isSubmitting}
							className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50'
						>
							{isSubmitting
								? 'Processando...'
								: isLogin
								? 'Entrar'
								: 'Registrar'}
						</button>
					</Form>
				)}
			</Formik>

			{/* Alternar entre login e registro */}
			<div className='mt-4 text-center'>
				<button
					onClick={() => setIsLogin(!isLogin)}
					className='text-blue-600 hover:text-blue-800'
				>
					{isLogin
						? 'Não tem uma conta? Registre-se'
						: 'Já tem uma conta? Faça login'}
				</button>
			</div>
		</div>
	);
};

export default LoginPage;
