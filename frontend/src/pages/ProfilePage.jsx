import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
	const [user, setUser] = useState({});
	const [name, setName] = useState('');
	const [bio, setBio] = useState('');

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get('/api/profile', {
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				});
				setUser(response.data);
				setName(response.data.name);
				setBio(response.data.bio);
			} catch (error) {
				console.error('Erro ao buscar perfil', error);
			}
		};
		fetchProfile();
	}, []);

	const handleUpdate = async () => {
		try {
			const response = await axios.put(
				'/api/profile',
				{ name, bio },
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				}
			);
			setUser(response.data.user);
			alert('Perfil atualizado com sucesso');
		} catch (error) {
			console.error('Erro ao atualizar perfil', error);
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Perfil</h1>
			<div className='mb-4'>
				<label className='block mb-2'>Email:</label>
				<input
					type='text'
					value={user.email}
					disabled
					className='p-2 border rounded w-full'
				/>
			</div>
			<div className='mb-4'>
				<label className='block mb-2'>Nome:</label>
				<input
					type='text'
					value={name}
					onChange={(e) => setName(e.target.value)}
					className='p-2 border rounded w-full'
				/>
			</div>
			<div className='mb-4'>
				<label className='block mb-2'>Bio:</label>
				<textarea
					value={bio}
					onChange={(e) => setBio(e.target.value)}
					className='p-2 border rounded w-full'
				/>
			</div>
			<button
				onClick={handleUpdate}
				className='bg-blue-500 text-white p-2 rounded'
			>
				Atualizar Perfil
			</button>
		</div>
	);
};

export default ProfilePage;
