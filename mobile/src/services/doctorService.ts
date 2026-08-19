import { getBaseUrl } from './api';

export async function fetchNearbyDoctors(lat: number, lng: number, specialty = '', radius = 5000, query = '') {
  try {
    const res = await fetch(`${getBaseUrl()}/doctor/nearby?lat=${lat}&lng=${lng}&radius=${radius}&specialty=${encodeURIComponent(specialty)}&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn('Doctor API request failed, returning client fallback:', err.message);
    return {
      status: 'FALLBACK',
      provider: 'client_fallback',
      userLocation: { lat, lng },
      results: getClientFallbackDoctors(specialty)
    };
  }
}

export async function fetchAPIKeyStatus() {
  try {
    const res = await fetch(`${getBaseUrl()}/config/keys`);
    if (!res.ok) throw new Error('Failed to fetch key status');
    return await res.json();
  } catch (err) {
    return {
      status: 'ERROR',
      hasGooglePlaces: false,
      hasGemini: false,
      keys: { googlePlacesKey: '', geminiKey: '' }
    };
  }
}

export async function saveAPIKeys({ googlePlacesKey, geminiKey }: { googlePlacesKey?: string; geminiKey?: string }) {
  try {
    const res = await fetch(`${getBaseUrl()}/config/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ googlePlacesKey, geminiKey })
    });
    return await res.json();
  } catch (err: any) {
    return { status: 'ERROR', message: err.message };
  }
}

export function getClientFallbackDoctors(specialty = '') {
  const doctors = [
    { id: 'fb-doc-1', name: 'Dr. Sarah Johnson', specialty: 'General Practitioner', rating: 4.8, exp: '12 years', phone: '+1 (555) 234-5678', available: true, distanceKm: 0.5, distanceFormatted: '0.5 km', address: 'Suite 201, Health Tower', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80' },
    { id: 'fb-doc-2', name: 'Dr. Michael Chen', specialty: 'Internal Medicine', rating: 4.9, exp: '15 years', phone: '+1 (555) 345-6789', available: true, distanceKm: 1.2, distanceFormatted: '1.2 km', address: '450 Wellness Plaza', photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80' },
    { id: 'fb-doc-3', name: 'Dr. Emily Williams', specialty: 'Family Medicine', rating: 4.7, exp: '8 years', phone: '+1 (555) 456-7890', available: false, distanceKm: 2.0, distanceFormatted: '2.0 km', address: '12 Community Care Way', photo: 'https://images.unsplash.com/photo-1594824813571-215f074d2b29?w=500&auto=format&fit=crop&q=80' },
    { id: 'fb-doc-4', name: 'Dr. Robert Carter', specialty: 'Cardiologist', rating: 4.9, exp: '18 years', phone: '+1 (555) 567-8901', available: true, distanceKm: 1.8, distanceFormatted: '1.8 km', address: '120 Heartbeat Way', photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80' },
    { id: 'fb-doc-5', name: 'Dr. Amanda Ross', specialty: 'Dermatologist', rating: 4.7, exp: '9 years', phone: '+1 (555) 789-0123', available: true, distanceKm: 0.8, distanceFormatted: '0.8 km', address: '15 Smooth Skin Rd', photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=80' },
    { id: 'fb-doc-6', name: 'Dr. Helena Garcia', specialty: 'Gynecologist', rating: 4.9, exp: '20 years', phone: '+1 (555) 012-3456', available: true, distanceKm: 1.1, distanceFormatted: '1.1 km', address: '78 Baby Steps Lane', photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80' }
  ];

  if (!specialty) return doctors;
  const sLower = specialty.toLowerCase();
  return doctors.filter(d => d.specialty.toLowerCase().includes(sLower));
}
