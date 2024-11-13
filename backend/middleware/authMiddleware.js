import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
	// Extrai o token do cabeçalho Authorization
	const token = req.header('Authorization')?.split(' ')[1];

	if (!token) {
		return res.status(401).json({
			message: 'Acesso não autorizado: token não fornecido.',
		});
	}

	// Verifica e decodifica o token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // Adiciona os dados do usuário à requisição
		next(); // Chama o próximo middleware ou a rota
	} catch (error) {
		// Se o erro for de token expirado, retorna uma mensagem específica
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({
				message: 'Token expirado: por favor, faça login novamente.',
			});
		}
		// Para outros erros de token (inválido, malformado, etc.)
		return res.status(401).json({
			message: 'Token inválido: não autorizado.',
		});
	}
};

export default authMiddleware;
