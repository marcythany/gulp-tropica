import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
	email: Yup.string().email('Email inválido').required('Email é obrigatório'),
	password: Yup.string()
		.min(6, 'Senha deve ter pelo menos 6 caracteres')
		.required('Senha é obrigatória'),
});

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

const LoginForm = ({ isLogin, onSubmit, toggleForm }) => {
	// Ajuste dos valores iniciais para evitar estado "undefined"
	const initialValues = {
		name: '', // Sempre defina 'name', mesmo que não seja usado no modo de login
		email: '',
		password: '',
		confirmPassword: '', // Sempre defina 'confirmPassword', mesmo que não seja usado no modo de login
	};

	return (
		<>
			<Formik
				initialValues={initialValues}
				validationSchema={isLogin ? loginSchema : registerSchema}
				onSubmit={onSubmit}
			>
				{({ errors, touched, isSubmitting }) => (
					<Form className='space-y-4'>
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

			<div className='mt-4 text-center'>
				<button
					onClick={toggleForm}
					className='text-blue-600 hover:text-blue-800'
				>
					{isLogin
						? 'Não tem uma conta? Registre-se'
						: 'Já tem uma conta? Faça login'}
				</button>
			</div>
		</>
	);
};

export default LoginForm;
