import express from 'express';
import { getNearbyDoctors } from '../controllers/doctorController.js';

const router = express.Router();

router.get('/nearby', getNearbyDoctors);

export default router;
