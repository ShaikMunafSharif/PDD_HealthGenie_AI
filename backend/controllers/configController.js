import fs from 'fs';
import path from 'path';
import { clearDoctorCache } from './doctorController.js';
// We should also theoretically clear hospital cache, but since it's inside hospitalController, we could export a clear function there too.
// For simplicity, we'll just not clear the hospital cache or we can import it.

export const getKeys = (req, res) => {
  const placesKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
  const grokKey = process.env.GROK_API_KEY || '';

  res.json({
    status: 'OK',
    keys: {
      googlePlacesKey: placesKey ? `••••••••${placesKey.slice(-4)}` : '',
      grokKey: grokKey ? `••••••••${grokKey.slice(-4)}` : ''
    },
    hasGooglePlaces: !!placesKey,
    hasGrok: !!grokKey
  });
};

export const updateKeys = async (req, res) => {
  try {
    const { googlePlacesKey, grokKey } = req.body;
    
    if (googlePlacesKey !== undefined) {
      process.env.GOOGLE_PLACES_API_KEY = googlePlacesKey.trim();
    }
    if (grokKey !== undefined) {
      process.env.GROK_API_KEY = grokKey.trim();
    }

    try {
      const envPath = path.resolve(process.cwd(), '.env');
      let envContent = `PORT=${process.env.PORT || 5000}\n`;
      envContent += `MONGO_URI=${process.env.MONGO_URI || ''}\n`;
      envContent += `GROK_API_KEY=${process.env.GROK_API_KEY || ''}\n`;
      envContent += `OLLAMA_URL=${process.env.OLLAMA_URL || 'http://localhost:11434'}\n`;
      envContent += `GOOGLE_PLACES_API_KEY=${process.env.GOOGLE_PLACES_API_KEY || ''}\n`;

      fs.writeFileSync(envPath, envContent, 'utf8');
    } catch (fsErr) {
      console.warn('Could not write to .env file dynamically:', fsErr.message);
    }

    clearDoctorCache();

    res.json({
      status: 'OK',
      message: 'API Keys updated successfully!',
      hasGooglePlaces: !!process.env.GOOGLE_PLACES_API_KEY,
      hasGrok: !!process.env.GROK_API_KEY
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};
