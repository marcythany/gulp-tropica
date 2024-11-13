import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		videoId: { type: String, required: true },
		title: { type: String, required: true },
		// Adicione outros campos conforme necessário
	},
	{ timestamps: true }
);

export default mongoose.model('Favorite', FavoriteSchema);
