import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Keeping string ID for backward compatibility with existing hardcoded/google IDs
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'General Hospital', 'Emergency Hospital', 'Medical Clinic'
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  user_ratings_total: { type: Number, default: 0 },
  is24hr: { type: Boolean, default: false },
  emergency: { type: Boolean, default: false },
  openNow: { type: Boolean, default: true },
  address: { type: String, required: true },
  phone: { type: String, default: '' },
  website: { type: String, default: '' },
  photo: { type: String, default: '' },
  vicinity: { type: String, default: '' }
}, {
  timestamps: true
});

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;
