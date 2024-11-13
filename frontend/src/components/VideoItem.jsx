import React from 'react';
import { addFavorite } from '../services/videoService';

const VideoItem = ({ video }) => {
	const handleAddFavorite = async () => {
		try {
			await addFavorite({
				videoId: video.id.videoId,
				title: video.snippet.title,
			});
			alert('Vídeo adicionado aos favoritos');
		} catch (error) {
			console.error('Erro ao adicionar vídeo aos favoritos', error);
		}
	};

	return (
		<div className='p-4 border rounded'>
			<img
				src={video.snippet.thumbnails.medium.url}
				alt={video.snippet.title}
				className='mb-2'
			/>
			<h2 className='font-bold'>{video.snippet.title}</h2>
			<p>{video.snippet.description}</p>
			<button
				onClick={handleAddFavorite}
				className='bg-blue-500 text-white p-2 rounded mt-2'
			>
				Adicionar aos Favoritos
			</button>
		</div>
	);
};

export default VideoItem;
