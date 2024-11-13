import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		console.error('Token inválido:', error);
		throw error;
	}
};

export { generateToken, verifyToken };
