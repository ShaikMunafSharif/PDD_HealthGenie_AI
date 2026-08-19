import { getValidatedMealImageRecord } from '../services/mealImageService.js';

export const generateMealImagePost = async (req, res) => {
  try {
    const { mealTitle, mealType = 'lunch', description = '' } = req.body;
    if (!mealTitle) {
      return res.status(400).json({ status: 'ERROR', message: 'mealTitle parameter is required' });
    }

    const record = await getValidatedMealImageRecord({ mealTitle, mealType, description });
    return res.json({
      status: 'OK',
      ...record
    });
  } catch (err) {
    console.error('[Backend] Error generating meal image record:', err);
    return res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

export const generateMealImageGet = async (req, res) => {
  try {
    const mealTitle = req.query.mealTitle || req.query.title || '';
    const mealType = req.query.mealType || req.query.type || 'lunch';
    const description = req.query.description || '';

    if (!mealTitle) {
      return res.status(400).json({ status: 'ERROR', message: 'mealTitle query parameter is required' });
    }

    const record = await getValidatedMealImageRecord({ mealTitle, mealType, description });
    return res.json({
      status: 'OK',
      ...record
    });
  } catch (err) {
    console.error('[Backend] Error fetching meal image record:', err);
    return res.status(500).json({ status: 'ERROR', message: err.message });
  }
};
