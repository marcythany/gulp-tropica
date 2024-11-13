import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
	const token = req.header('Authorization')?.split(' ')[1];

	if (!token) {
		return res
			.status(401)
			.json({ message: 'Acesso não autorizado, token não fornecido.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res
				.status(401)
				.json({ message: 'Token expirado, por favor faça login novamente.' });
		}
		res.status(401).json({ message: 'Token inválido' });
	}
};

export default authMiddleware;
