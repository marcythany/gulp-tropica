import rateLimit from 'express-rate-limit';

const videoLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 20, // Limita cada IP a 20 requisições por janela de 15 minutos
	message:
		'Muitas requisições de busca de vídeos, por favor, tente novamente após 15 minutos.',
});

export { videoLimiter };
