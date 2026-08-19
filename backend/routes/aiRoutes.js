import express from 'express';
import { chatStream, recommendHospitals } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chatStream);
router.post('/recommend-hospitals', recommendHospitals);

export default router;
