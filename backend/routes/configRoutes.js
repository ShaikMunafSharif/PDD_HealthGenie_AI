import express from 'express';
import { getKeys, updateKeys } from '../controllers/configController.js';

const router = express.Router();

router.get('/keys', getKeys);
router.post('/keys', updateKeys);

export default router;
