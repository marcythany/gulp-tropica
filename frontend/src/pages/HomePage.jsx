import React, { useState, useEffect } from 'react';
import { searchVideos } from '../services/videoService';
import VideoItem from '../components/VideoItem';

const HomePage = () => {
	const [videos, setVideos] = useState([]);
	const [tag, setTag] = useState('');

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const result = await searchVideos(tag);
				setVideos(result);
			} catch (error) {
				console.error('Erro ao buscar vídeos', error);
			}
		};
		fetchVideos();
	}, [tag]);

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Vídeos</h1>
			<input
				type='text'
				placeholder='Pesquisar por tag'
				value={tag}
				onChange={(e) => setTag(e.target.value)}
				className='p-2 border rounded w-full mb-4'
			/>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{videos.map((video, index) => (
					<VideoItem key={`${video.id.videoId}_${index}`} video={video} />
				))}
			</div>
		</div>
	);
};

export default HomePage;
