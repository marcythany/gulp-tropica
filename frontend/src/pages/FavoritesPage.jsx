import React, { useState, useEffect } from 'react';
import { getFavorites } from '../services/videoService';
import VideoItem from '../components/VideoItem';
import useAuth from '../hooks/useAuth';
import { FaSpinner } from 'react-icons/fa';

const FavoritesPage = () => {
	const [favorites, setFavorites] = useState([]); // Inicializar sempre como um array vazio
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	useEffect(() => {
		if (user) {
			fetchFavorites();
		}
	}, [user]); // Adicionar dependência ao 'user'

	const fetchFavorites = async () => {
		try {
			setLoading(true);
			const response = await getFavorites();
			setFavorites(response?.data || []); // Garantir que sempre será um array
			setError(null);
		} catch (err) {
			console.error('Erro ao buscar favoritos:', err);
			setError('Não foi possível carregar seus vídeos favoritos');
		} finally {
			setLoading(false);
		}
	};

	const handleFavoriteToggle = (videoId, isFavorite) => {
		if (!isFavorite) {
			setFavorites(favorites.filter((video) => video.id.videoId !== videoId));
		}
	};

	if (!user) {
		return (
			<div className='text-center py-12'>
				<h2 className='text-2xl font-bold text-gray-800 mb-4'>
					Faça login para ver seus favoritos
				</h2>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4'>
			<h1 className='text-2xl font-bold mb-6'>Meus Vídeos Favoritos</h1>

			{loading ? (
				<div className='flex justify-center items-center py-12'>
					<FaSpinner className='animate-spin text-4xl text-blue-500' />
				</div>
			) : error ? (
				<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
					{error}
				</div>
			) : favorites && favorites.length === 0 ? ( // Verificação de 'favorites'
				<div className='text-center py-12'>
					<h2 className='text-xl text-gray-600'>
						Você ainda não tem vídeos favoritos
					</h2>
					<p className='text-gray-500 mt-2'>
						Explore a página inicial para encontrar vídeos interessantes
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{favorites?.map(
						(
							video // Verificação de 'favorites'
						) => (
							<VideoItem
								key={video.id.videoId}
								video={video}
								isFavorite={true}
								onFavoriteToggle={handleFavoriteToggle}
							/>
						)
					)}
				</div>
			)}
		</div>
	);
};

export default FavoritesPage;
