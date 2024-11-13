import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

export const register = async (req, res) => {
	const { email, password, name } = req.body;
	if (!email || !password || !name) {
		return res
			.status(400)
			.json({ message: 'Todos os campos são obrigatórios' });
	}
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = new User({ email, password: hashedPassword, name });
		await user.save();
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});
		res.status(201).json({ user, token });
	} catch (error) {
		res.status(500).json({ message: 'Erro ao registrar o usuário', error });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ message: 'Email ou senha incorretos' });
		}
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});
		res.json({ user, token });
	} catch (error) {
		res.status(500).json({ message: 'Erro ao fazer login', error });
	}
};
