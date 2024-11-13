import React, { useState } from 'react';
import { FaHeart, FaShare } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { addToFavorites, removeFromFavorites } from '../services/videoService';

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
			// Você pode adicionar um toast ou notificação aqui
			alert('Faça login para favoritar vídeos');
			return;
		}

		setIsLoading(true);
		try {
			if (isFavorite) {
				// Remover dos favoritos
				await removeFromFavorites(video.id.videoId);
			} else {
				// Adicionar aos favoritos
				await addToFavorites({
					videoId: video.id.videoId,
					title: video.snippet.title,
					thumbnail: video.snippet.thumbnails.medium.url,
					channelTitle: video.snippet.channelTitle,
					description: video.snippet.description,
				});
			}

			setIsFavorite(!isFavorite);
			if (onFavoriteToggle) {
				onFavoriteToggle(video.id.videoId, !isFavorite);
			}
		} catch (error) {
			console.error('Erro ao atualizar favoritos:', error);
			alert('Erro ao atualizar favoritos');
		} finally {
			setIsLoading(false);
		}
	};

	const handleShare = () => {
		const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
		navigator.clipboard.writeText(videoUrl).then(() => {
			alert('Link copiado para a área de transferência!');
		});
	};

	const redirectToYoutube = () => {
		window.open(
			`https://www.youtube.com/watch?v=${video.id.videoId}`,
			'_blank',
			'noopener,noreferrer'
		);
	};

	return (
		<div className='bg-white rounded-lg shadow-lg overflow-hidden'>
			<div
				className='aspect-w-16 aspect-h-9'
				onClick={redirectToYoutube}
				style={{ cursor: 'pointer' }}
			>
				<img
					src={video.snippet.thumbnails.medium.url}
					alt={video.snippet.title}
					className='object-cover w-full h-48'
				/>
			</div>

			<div className='p-4'>
				<h3
					className='text-lg font-semibold line-clamp-2 mb-2'
					onClick={redirectToYoutube}
					style={{ cursor: 'pointer' }}
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
						className={`flex items-center space-x-1 px-3 py-1 rounded ${
							isFavorite
								? 'text-red-500 hover:text-red-600'
								: 'text-gray-500 hover:text-red-500'
						}`}
					>
						<FaHeart
							className={`text-lg ${isLoading ? 'animate-pulse' : ''}`}
						/>
						<span>{isFavorite ? 'Favoritado' : 'Favoritar'}</span>
					</button>

					<button
						onClick={handleShare}
						className='flex items-center space-x-1 px-3 py-1 rounded text-gray-500 hover:text-blue-500'
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
