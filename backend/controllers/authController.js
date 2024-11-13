import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Exemplo de senha forte: mínimo 8 caracteres, contendo letras e números

export const register = async (req, res) => {
	const { email, password } = req.body;

	// Validação de email
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({ message: 'Formato de email inválido' });
	}

	// Validação de senha
	if (!passwordStrengthRegex.test(password)) {
		return res.status(400).json({
			message:
				'Senha deve ter pelo menos 8 caracteres, contendo letras e números.',
		});
	}

	try {
		// Verifique se o email já está em uso
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: 'Email já cadastrado' });
		}

		// Criptografe a senha
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = new User({ email, password: hashedPassword });
		await user.save();

		res.status(201).json({ message: 'Usuário registrado com sucesso' });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: 'Erro ao registrar o usuário', error: error.message });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		// Encontre o usuário
		const user = await User.findOne({ email });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ message: 'Email ou senha incorretos' });
		}

		// Gere o token JWT
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		res.json({ token });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: 'Erro ao fazer login', error: error.message });
	}
};
