import express from 'express';
import { getNearbyHospitals, getHospitalAutocomplete } from '../controllers/hospitalController.js';

const router = express.Router();

router.get('/nearby', getNearbyHospitals);
router.get('/autocomplete', getHospitalAutocomplete);

export default router;
