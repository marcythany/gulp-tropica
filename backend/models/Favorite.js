import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'O campo userId é obrigatório'],
		},
		videoId: {
			type: String,
			required: [true, 'O campo videoId é obrigatório'],
			trim: true, // Garantir que não haja espaços extras no início ou fim
		},
		title: {
			type: String,
			required: [true, 'O campo title é obrigatório'],
			trim: true, // Garantir que o título não tenha espaços extras
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Favorite', FavoriteSchema);
