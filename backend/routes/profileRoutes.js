import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import {
	validateRequest,
	updateProfileSchema,
} from '../middleware/validationMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rota para obter o perfil do usuário
router.get('/', authMiddleware, getProfile);

// Rota para atualizar o perfil do usuário com validação
router.put(
	'/',
	authMiddleware,
	validateRequest(updateProfileSchema),
	updateProfile
);

export default router;
