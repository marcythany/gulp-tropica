import express from 'express';
import {
	getVideos,
	addFavorite,
	getFavorites,
} from '../controllers/videoController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { videoLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/search', videoLimiter, getVideos);
router.post('/favorites', authMiddleware, addFavorite);
router.get('/favorites', authMiddleware, getFavorites);

export default router;
