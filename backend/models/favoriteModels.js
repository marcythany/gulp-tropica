import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	videoId: {
		type: String, // Usando String caso os vídeos tenham um ID personalizado como no YouTube
		required: true,
	},
});

export const Favorite = mongoose.model('Favorite', favoriteSchema);
