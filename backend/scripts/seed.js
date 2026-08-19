import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hospital from '../models/Hospital.js';
import Doctor from '../models/Doctor.js';

dotenv.config();

const baseHospitals = [
  {
    id: 'hosp-1',
    name: 'City General Hospital & Emergency Care',
    type: 'General Hospital',
    lat: 17.3920,
    lng: 78.4917,
    rating: 4.8,
    user_ratings_total: 342,
    is24hr: true,
    emergency: true,
    openNow: true,
    address: '124 Healthcare Boulevard, Medical District',
    phone: '+1 (555) 019-2834',
    website: 'https://citygeneralhealth.org',
    photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
    vicinity: 'Central Medical District'
  },
  {
    id: 'hosp-2',
    name: 'St. Jude Multi-Specialty Hospital',
    type: 'Multi-Specialty',
    lat: 17.3730,
    lng: 78.4947,
    rating: 4.6,
    user_ratings_total: 215,
    is24hr: true,
    emergency: true,
    openNow: true,
    address: '45 Emergency Care Ave, West Wing',
    phone: '+1 (555) 014-9921',
    website: 'https://stjude-medical.org',
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    vicinity: 'Westside Healthcare Corridor'
  },
  {
    id: 'hosp-3',
    name: 'Metro Trauma Center & Intensive Care',
    type: 'Trauma Center',
    lat: 17.4000,
    lng: 78.4767,
    rating: 4.9,
    user_ratings_total: 512,
    is24hr: true,
    emergency: true,
    openNow: true,
    address: '89 Trauma Parkway, North Station',
    phone: '+1 (555) 011-8833',
    website: 'https://metrotrauma.org',
    photo: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
    vicinity: 'North Medical Hub'
  },
  {
    id: 'hosp-4',
    name: 'Apex Children & Women Hospital',
    type: 'Pediatric & Maternity',
    lat: 17.3770,
    lng: 78.4727,
    rating: 4.7,
    user_ratings_total: 189,
    is24hr: false,
    emergency: false,
    openNow: true,
    address: '302 Pediatrics Road, Park View',
    phone: '+1 (555) 017-4400',
    website: 'https://apexchildrens.org',
    photo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
    vicinity: 'Park View Avenue'
  },
  {
    id: 'hosp-5',
    name: 'Sunrise Community Urgent Care Clinic',
    type: 'Urgent Care Clinic',
    lat: 17.3880,
    lng: 78.4827,
    rating: 4.3,
    user_ratings_total: 98,
    is24hr: false,
    emergency: false,
    openNow: true,
    address: '15 Sunrise Boulevard, Suite 100',
    phone: '+1 (555) 018-7722',
    website: 'https://sunriseurgentcare.com',
    photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&auto=format&fit=crop&q=80',
    vicinity: 'Downtown Square'
  }
];

const baseDoctors = [
  { id: 'doc-mock-1', name: 'Dr. Sarah Johnson', specialty: 'General Practitioner', rating: 4.8, user_ratings_total: 45, exp: '12 years', phone: '+1 (555) 234-5678', available: true, address: 'Suite 201, Health Tower', lat: 17.3900, lng: 78.4907, photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80' },
  { id: 'doc-mock-2', name: 'Dr. Michael Chen', specialty: 'Internal Medicine', rating: 4.9, user_ratings_total: 57, exp: '15 years', phone: '+1 (555) 345-6789', available: true, address: '450 Wellness Plaza', lat: 17.3770, lng: 78.4927, photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80' },
  { id: 'doc-mock-3', name: 'Dr. Emily Williams', specialty: 'Family Medicine', rating: 4.7, user_ratings_total: 69, exp: '8 years', phone: '+1 (555) 456-7890', available: false, address: '12 Community Care Way', lat: 17.3970, lng: 78.4797, photo: 'https://images.unsplash.com/photo-1594824813571-215f074d2b29?w=500&auto=format&fit=crop&q=80' },
  { id: 'doc-mock-4', name: 'Dr. Robert Carter', specialty: 'Cardiologist', rating: 4.9, user_ratings_total: 81, exp: '18 years', phone: '+1 (555) 567-8901', available: true, address: '120 Heartbeat Way', lat: 17.3820, lng: 78.4817, photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80' },
  { id: 'doc-mock-5', name: 'Dr. Lisa Vance', specialty: 'Cardiologist', rating: 4.8, user_ratings_total: 93, exp: '14 years', phone: '+1 (555) 678-9012', available: false, address: '88 Vascular Blvd', lat: 17.4000, lng: 78.4967, photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80' },
  { id: 'doc-mock-6', name: 'Dr. Amanda Ross', specialty: 'Dermatologist', rating: 4.7, user_ratings_total: 105, exp: '9 years', phone: '+1 (555) 789-0123', available: true, address: '15 Smooth Skin Rd', lat: 17.3740, lng: 78.4777, photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=80' },
  { id: 'doc-mock-7', name: 'Dr. David Kim', specialty: 'Dermatologist', rating: 4.9, user_ratings_total: 117, exp: '16 years', phone: '+1 (555) 890-1234', available: true, address: '99 Laser Ave', lat: 17.3900, lng: 78.4907, photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80' },
  { id: 'doc-mock-8', name: 'Dr. Thomas Albright', specialty: 'Orthopedist', rating: 4.8, user_ratings_total: 129, exp: '15 years', phone: '+1 (555) 901-2345', available: true, address: '22 Backbone Way', lat: 17.3770, lng: 78.4927, photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80' },
  { id: 'doc-mock-9', name: 'Dr. Helena Garcia', specialty: 'Gynecologist', rating: 4.9, user_ratings_total: 141, exp: '20 years', phone: '+1 (555) 012-3456', available: true, address: '78 Baby Steps Lane', lat: 17.3970, lng: 78.4797, photo: 'https://images.unsplash.com/photo-1594824813571-215f074d2b29?w=500&auto=format&fit=crop&q=80' },
  { id: 'doc-mock-10', name: 'Dr. Alan Turing', specialty: 'Neurologist', rating: 4.9, user_ratings_total: 153, exp: '22 years', phone: '+1 (555) 123-4567', available: true, address: '50 Synapse Blvd', lat: 17.3820, lng: 78.4817, photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80' }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('❌ MONGO_URI is not set in .env file. Cannot seed data.');
      process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected for Seeding');

    await Hospital.deleteMany();
    await Doctor.deleteMany();
    console.log('🗑️  Cleared existing Hospitals and Doctors from DB');

    await Hospital.insertMany(baseHospitals);
    console.log(`✅ Seeded ${baseHospitals.length} Hospitals`);

    await Doctor.insertMany(baseDoctors);
    console.log(`✅ Seeded ${baseDoctors.length} Doctors`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
