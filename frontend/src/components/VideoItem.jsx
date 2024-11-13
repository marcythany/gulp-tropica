import React, { useState } from 'react';
import { FaHeart, FaShare } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { addToFavorites, removeFromFavorites } from '../services/videoService';
import toast from 'react-hot-toast';

const VideoItem = ({
	video,
	isFavorite: initialIsFavorite = false,
	onFavoriteToggle,
}) => {
	const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuth();

	const toggleFavorite = async () => {
		if (!user) {
			toast.warning('Faça login para favoritar vídeos');
			return;
		}

		setIsLoading(true);
		try {
			const token = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('Token não encontrado. Por favor, faça login.');
			}

			if (isFavorite) {
				await removeFromFavorites(video.id.videoId);
				toast.success('Vídeo removido dos favoritos');
			} else {
				await addToFavorites({
					videoId: video.id.videoId,
					title: video.snippet.title,
					thumbnail: video.snippet.thumbnails.medium.url,
					channelTitle: video.snippet.channelTitle,
					description: video.snippet.description,
				});
				toast.success('Vídeo adicionado aos favoritos');
			}

			setIsFavorite(!isFavorite);
			if (onFavoriteToggle) {
				onFavoriteToggle(video.id.videoId, !isFavorite);
			}
		} catch (error) {
			console.error('Erro ao atualizar favoritos:', error);
			toast.error(error.message || 'Erro ao atualizar favoritos');
		} finally {
			setIsLoading(false);
		}
	};

	const handleShare = async () => {
		try {
			const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
			await navigator.clipboard.writeText(videoUrl);
			toast.success('Link copiado para a área de transferência!');
		} catch (error) {
			console.error('Erro ao copiar link:', error);
			toast.error('Erro ao copiar link');
		}
	};

	const redirectToYoutube = () => {
		const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
		window.open(videoUrl, '_blank', 'noopener,noreferrer');
	};

	return (
		<div className='bg-white rounded-lg shadow-lg overflow-hidden'>
			<div
				className='aspect-w-16 aspect-h-9 cursor-pointer'
				onClick={redirectToYoutube}
			>
				<img
					src={video.snippet.thumbnails.medium.url}
					alt={video.snippet.title}
					className='object-cover w-full h-48'
				/>
			</div>

			<div className='p-4'>
				<h3
					className='text-lg font-semibold line-clamp-2 mb-2 cursor-pointer'
					onClick={redirectToYoutube}
				>
					{video.snippet.title}
				</h3>

				<p className='text-sm text-gray-600 mb-2'>
					{video.snippet.channelTitle}
				</p>

				<p className='text-sm text-gray-500 line-clamp-2 mb-4'>
					{video.snippet.description}
				</p>

				<div className='flex justify-between items-center'>
					<button
						onClick={toggleFavorite}
						disabled={isLoading}
						className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors duration-200 ${
							isFavorite
								? 'text-red-500 hover:text-red-600'
								: 'text-gray-500 hover:text-red-500'
						} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						<FaHeart
							className={`text-lg ${isLoading ? 'animate-pulse' : ''}`}
						/>
						<span>{isFavorite ? 'Favoritado' : 'Favoritar'}</span>
					</button>

					<button
						onClick={handleShare}
						className='flex items-center space-x-1 px-3 py-1 rounded text-gray-500 hover:text-blue-500 transition-colors duration-200'
					>
						<FaShare className='text-lg' />
						<span>Compartilhar</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default VideoItem;
