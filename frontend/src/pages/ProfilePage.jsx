import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaSpinner, FaCheck, FaTimes, FaCamera } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

const profileSchema = Yup.object().shape({
	name: Yup.string()
		.required('Nome é obrigatório')
		.min(2, 'Nome deve ter pelo menos 2 caracteres'),
	email: Yup.string().email('Email inválido').required('Email é obrigatório'),
	bio: Yup.string().max(200, 'Bio deve ter no máximo 200 caracteres'),
	avatarUrl: Yup.string().url('URL inválida').nullable(),
	currentPassword: Yup.string().min(
		6,
		'Senha atual deve ter pelo menos 6 caracteres'
	),
	newPassword: Yup.string()
		.min(6, 'Nova senha deve ter pelo menos 6 caracteres')
		.test(
			'passwords-match',
			'Nova senha deve ser diferente da atual',
			function (value) {
				return !value || value !== this.parent.currentPassword;
			}
		),
	confirmNewPassword: Yup.string().oneOf(
		[Yup.ref('newPassword'), null],
		'Senhas devem ser iguais'
	),
});

const ProfilePage = () => {
	const { user, updateUserProfile } = useAuth();
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [updateError, setUpdateError] = useState('');
	const [previewAvatar, setPreviewAvatar] = useState(user?.avatarUrl || '');

	if (!user) {
		return (
			<div className='flex justify-center items-center h-96'>
				<FaSpinner className='animate-spin text-4xl text-blue-500' />
			</div>
		);
	}

	const handleSubmit = async (values, { setSubmitting }) => {
		try {
			setUpdateSuccess(false);
			setUpdateError('');

			const updateData = {
				name: values.name,
				email: values.email,
				bio: values.bio,
				avatarUrl: values.avatarUrl,
			};

			if (values.currentPassword && values.newPassword) {
				updateData.currentPassword = values.currentPassword;
				updateData.newPassword = values.newPassword;
			}

			const result = await updateUserProfile(updateData);

			if (result.success) {
				setUpdateSuccess(true);
				setTimeout(() => setUpdateSuccess(false), 3000);
			} else {
				setUpdateError(result.error);
			}
		} catch (error) {
			setUpdateError('Erro ao atualizar perfil. Tente novamente.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className='max-w-2xl mx-auto p-4'>
			<div className='bg-white rounded-lg shadow-lg p-6'>
				<div className='flex flex-col items-center justify-center mb-6'>
					<div className='relative group'>
						<div className='w-32 h-32 rounded-full overflow-hidden bg-blue-100 mb-2'>
							{previewAvatar ? (
								<img
									src={previewAvatar}
									alt='Avatar'
									className='w-full h-full object-cover'
									onError={() => setPreviewAvatar('')}
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center'>
									<FaUser className='text-5xl text-blue-600' />
								</div>
							)}
						</div>
					</div>
				</div>

				<h1 className='text-2xl font-bold text-center mb-8'>Meu Perfil</h1>

				{updateSuccess && (
					<div className='mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center'>
						<FaCheck className='mr-2' />
						Perfil atualizado com sucesso!
					</div>
				)}

				{updateError && (
					<div className='mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center'>
						<FaTimes className='mr-2' />
						{updateError}
					</div>
				)}

				<Formik
					initialValues={{
						name: user.name || '',
						email: user.email || '',
						bio: user.bio || '',
						avatarUrl: user.avatarUrl || '',
						currentPassword: '',
						newPassword: '',
						confirmNewPassword: '',
					}}
					validationSchema={profileSchema}
					onSubmit={handleSubmit}
				>
					{({ errors, touched, isSubmitting, setFieldValue, values }) => (
						<Form className='space-y-6'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									URL do Avatar
								</label>
								<Field
									name='avatarUrl'
									type='text'
									className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
									onChange={(e) => {
										setFieldValue('avatarUrl', e.target.value);
										setPreviewAvatar(e.target.value);
									}}
								/>
								{errors.avatarUrl && touched.avatarUrl && (
									<div className='text-red-500 text-sm mt-1'>
										{errors.avatarUrl}
									</div>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Nome
								</label>
								<Field
									name='name'
									type='text'
									className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
								/>
								{errors.name && touched.name && (
									<div className='text-red-500 text-sm mt-1'>{errors.name}</div>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Email
								</label>
								<Field
									name='email'
									type='email'
									className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
								/>
								{errors.email && touched.email && (
									<div className='text-red-500 text-sm mt-1'>
										{errors.email}
									</div>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Bio
									<span className='text-gray-400 text-xs ml-2'>
										({values.bio?.length || 0}/200)
									</span>
								</label>
								<Field
									as='textarea'
									name='bio'
									rows='4'
									className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none'
								/>
								{errors.bio && touched.bio && (
									<div className='text-red-500 text-sm mt-1'>{errors.bio}</div>
								)}
							</div>

							<div className='border-t pt-6'>
								<h3 className='text-lg font-medium mb-4'>Alterar Senha</h3>

								<div className='space-y-4'>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Senha Atual
										</label>
										<Field
											name='currentPassword'
											type='password'
											className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
										/>
										{errors.currentPassword && touched.currentPassword && (
											<div className='text-red-500 text-sm mt-1'>
												{errors.currentPassword}
											</div>
										)}
									</div>

									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Nova Senha
										</label>
										<Field
											name='newPassword'
											type='password'
											className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
										/>
										{errors.newPassword && touched.newPassword && (
											<div className='text-red-500 text-sm mt-1'>
												{errors.newPassword}
											</div>
										)}
									</div>

									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Confirmar Nova Senha
										</label>
										<Field
											name='confirmNewPassword'
											type='password'
											className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
										/>
										{errors.confirmNewPassword &&
											touched.confirmNewPassword && (
												<div className='text-red-500 text-sm mt-1'>
													{errors.confirmNewPassword}
												</div>
											)}
									</div>
								</div>
							</div>

							<div className='flex justify-end'>
								<button
									type='submit'
									disabled={isSubmitting}
									className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
								>
									{isSubmitting && <FaSpinner className='animate-spin mr-2' />}
									{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
								</button>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default ProfilePage;
