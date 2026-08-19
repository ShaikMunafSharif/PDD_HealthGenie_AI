import express from 'express';
import { generateMealImageGet, generateMealImagePost } from '../controllers/dietController.js';

const router = express.Router();

router.get('/meal-image', generateMealImageGet);
router.post('/meal-image', generateMealImagePost);

export default router;
