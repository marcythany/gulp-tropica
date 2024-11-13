// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { z } from 'zod';

const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Senha forte (mínimo 8 caracteres, com letras e números)

// Esquema de validação de registro usando Zod
const registerSchema = z.object({
	email: z.string().email({ message: 'Formato de email inválido' }),
	password: z
		.string()
		.min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
		.regex(passwordStrengthRegex, {
			message: 'Senha deve conter letras e números',
		}),
	name: z.string().min(1, { message: 'Nome é obrigatório' }),
});

// Esquema de validação de login usando Zod
const loginSchema = z.object({
	email: z.string().email({ message: 'Formato de email inválido' }),
	password: z
		.string()
		.min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

export const register = async (req, res) => {
	try {
		// Validando os dados de entrada com Zod
		const parsedData = registerSchema.parse(req.body); // Validar dados
		const { email, password, name } = parsedData;

		// Verifique se o email já está em uso
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: 'Email já cadastrado' });
		}

		// Criptografe a senha
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = new User({ email, password: hashedPassword, name });
		await user.save();

		res.status(201).json({ message: 'Usuário registrado com sucesso' });
	} catch (error) {
		// Se houver erro de validação do Zod
		if (error instanceof z.ZodError) {
			return res
				.status(400)
				.json({ message: error.errors.map((err) => err.message).join(', ') });
		}
		console.error(error);
		res
			.status(500)
			.json({ message: 'Erro ao registrar o usuário', error: error.message });
	}
};

export const login = async (req, res) => {
	try {
		// Validando os dados de entrada com Zod
		const parsedData = loginSchema.parse(req.body); // Validar dados
		const { email, password } = parsedData;

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
		// Se houver erro de validação do Zod
		if (error instanceof z.ZodError) {
			return res
				.status(400)
				.json({ message: error.errors.map((err) => err.message).join(', ') });
		}
		console.error(error);
		res
			.status(500)
			.json({ message: 'Erro ao fazer login', error: error.message });
	}
};
