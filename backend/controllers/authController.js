import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
	const { email, password } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = new User({ email, password: hashedPassword });
		await user.save();
		res.status(201).json({ message: 'Usuário registrado com sucesso' });
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
		res.json({ token });
	} catch (error) {
		res.status(500).json({ message: 'Erro ao fazer login', error });
	}
};
