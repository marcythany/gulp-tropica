import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

export const getProfile = async (req, res) => {
	const userId = req.user.userId;
	try {
		const user = await User.findById(userId).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'Usuário não encontrado' });
		}
		res.json(user);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: 'Erro ao buscar perfil', error: error.message });
	}
};

export const updateProfile = async (req, res) => {
	const userId = req.user.userId;
	const { name, bio, avatarUrl } = req.body;
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'Usuário não encontrado' });
		}

		if (name) user.name = name;
		if (bio) user.bio = bio;
		if (avatarUrl) user.avatarUrl = avatarUrl;

		await user.save();

		// Gerar um novo token JWT com as informações atualizadas
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		res.json({ message: 'Perfil atualizado com sucesso', user, token });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: 'Erro ao atualizar perfil', error: error.message });
	}
};
