import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  rating: { type: Number, default: 0 },
  user_ratings_total: { type: Number, default: 0 },
  exp: { type: String, required: true }, // e.g., '12 years'
  phone: { type: String, default: '' },
  available: { type: Boolean, default: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  photo: { type: String, default: '' }
}, {
  timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
