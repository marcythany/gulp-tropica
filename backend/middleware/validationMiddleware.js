import { z } from 'zod';

// Função de validação genérica
const validateRequest = (schema) => {
	return (req, res, next) => {
		try {
			// Validando corpo da requisição, parâmetros de rota e query
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next(); // Se a validação passar, continua o fluxo
		} catch (err) {
			// Se o erro for do Zod
			if (err instanceof z.ZodError) {
				return res.status(400).json({
					message: 'Erro de validação nos dados de entrada',
					errors: err.errors, // erros específicos de validação do Zod
				});
			}
			// Se não for erro do Zod, passa para o próximo middleware de erro
			next(err);
		}
	};
};

// Schema de validação para login
const loginSchema = z.object({
	body: z.object({
		email: z.string().email({ message: 'O formato do email é inválido' }), // Validação do email
		password: z
			.string()
			.min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }), // Validação da senha
	}),
});

// Schema de validação para registro
const registerSchema = z.object({
	body: z.object({
		email: z.string().email({ message: 'O formato do email é inválido' }), // Validação do email
		password: z
			.string()
			.min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }), // Validação da senha
		name: z
			.string()
			.min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }), // Validação do nome
	}),
});

// Schema de validação para atualização de perfil
const updateProfileSchema = z.object({
	body: z.object({
		name: z
			.string()
			.min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
			.optional(), // Nome é opcional
		bio: z
			.string()
			.max(500, { message: 'A bio deve ter no máximo 500 caracteres' })
			.optional(), // Bio é opcional
		avatar: z
			.string()
			.url({ message: 'A URL do avatar deve ser válida' })
			.optional(), // Avatar é opcional, mas se fornecido, deve ser uma URL válida
	}),
});

export { validateRequest, loginSchema, registerSchema, updateProfileSchema };
