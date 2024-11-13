import User from '../models/User.js';

export const getProfile = async (req, res) => {
	const userId = req.user.userId;
	try {
		const user = await User.findById(userId).select('-password');
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: 'Erro ao buscar perfil', error });
	}
};

export const updateProfile = async (req, res) => {
	const userId = req.user.userId;
	const { name, bio } = req.body;
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'Usuário não encontrado' });
		}
		user.name = name || user.name;
		user.bio = bio || user.bio;
		// Atualize outros campos conforme necessário
		await user.save();
		res.json({ message: 'Perfil atualizado com sucesso', user });
	} catch (error) {
		res.status(500).json({ message: 'Erro ao atualizar perfil', error });
	}
};
