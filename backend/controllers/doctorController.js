import fetch from 'node-fetch';
import Doctor from '../models/Doctor.js';
import { calculateDistance, DOCTOR_PHOTO_POOL } from '../utils/helpers.js';

const doctorCache = new Map();

export const getNearbyDoctors = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || 17.3850;
    const lng = parseFloat(req.query.lng) || 78.4867;
    const radius = parseInt(req.query.radius) || 5000;
    const specialty = req.query.specialty || '';
    const query = req.query.query || '';
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

    const cacheKey = `doc_${lat.toFixed(3)}_${lng.toFixed(3)}_${radius}_${specialty}_${query}`;
    if (doctorCache.has(cacheKey)) {
      const cached = doctorCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) {
        return res.json(cached.data);
      }
    }

    let doctors = [];
    let provider = 'mock';

    // 1. Google Places API
    if (apiKey) {
      try {
        const searchTerm = specialty || query || 'doctor';
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=doctor&keyword=${encodeURIComponent(searchTerm)}&key=${apiKey}`;
        const googleRes = await fetch(url);
        const googleData = await googleRes.json();

        if (googleData.status === 'OK' && googleData.results) {
          provider = 'google_places';
          doctors = googleData.results.map((item, index) => {
            const dLat = item.geometry.location.lat;
            const dLng = item.geometry.location.lng;
            const dist = calculateDistance(lat, lng, dLat, dLng);
            const photoRef = item.photos && item.photos.length > 0 ? item.photos[0].photo_reference : null;

            return {
              id: item.place_id,
              name: item.name.startsWith('Dr.') ? item.name : `Dr. ${item.name}`,
              specialty: specialty || 'Specialist Physician',
              rating: item.rating || 4.7,
              user_ratings_total: item.user_ratings_total || 85,
              lat: dLat,
              lng: dLng,
              exp: `${8 + (index % 12)} years`,
              available: item.opening_hours?.open_now ?? true,
              address: item.vicinity || 'Local Medical Clinic',
              phone: '+1 (555) 019-3344',
              photo: photoRef ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photo_reference=${photoRef}&key=${apiKey}` : DOCTOR_PHOTO_POOL[index % DOCTOR_PHOTO_POOL.length],
              distanceKm: parseFloat(dist.toFixed(2)),
              distanceFormatted: `${dist.toFixed(1)} km`
            };
          });
        }
      } catch (gErr) {
        console.warn('Google Places Doctor API fetch failed, falling back to Overpass:', gErr.message);
      }
    }

    // 2. Overpass OSM API fallback
    if (doctors.length === 0) {
      try {
        const radiusKm = radius / 1000;
        const delta = radiusKm / 111.0;
        const bbox = `${lat - delta},${lng - delta},${lat + delta},${lng + delta}`;
        const overpassQuery = `[out:json][timeout:10];(node["healthcare"="doctor"](${bbox});node["amenity"="doctors"](${bbox});node["amenity"="clinic"](${bbox}););out center 20;`;

        const overpassRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
        if (overpassRes.ok) {
          const overpassData = await overpassRes.json();
          if (overpassData.elements && overpassData.elements.length > 0) {
            provider = 'overpass_osm';
            doctors = overpassData.elements.map((el, index) => {
              const dLat = el.lat || el.center?.lat || lat + (Math.random() - 0.5) * 0.02;
              const dLng = el.lon || el.center?.lon || lng + (Math.random() - 0.5) * 0.02;
              const rawName = el.tags?.name || el.tags?.['name:en'] || `Medical Specialist #${index + 1}`;
              const docName = rawName.startsWith('Dr.') ? rawName : `Dr. ${rawName}`;
              const dist = calculateDistance(lat, lng, dLat, dLng);

              return {
                id: `op-doc-${el.id || index}`,
                name: docName,
                specialty: el.tags?.healthcare?.speciality || specialty || 'General Practitioner',
                rating: parseFloat((4.5 + (index % 5) * 0.1).toFixed(1)),
                user_ratings_total: 60 + index * 20,
                exp: `${10 + (index % 10)} years`,
                available: true,
                address: el.tags?.['addr:street'] ? `${el.tags['addr:street']}, ${el.tags['addr:city'] || ''}` : 'Local Healthcare Clinic',
                phone: el.tags?.phone || '+1 (555) 012-8899',
                lat: dLat,
                lng: dLng,
                distanceKm: parseFloat(dist.toFixed(2)),
                distanceFormatted: `${dist.toFixed(1)} km`,
                photo: DOCTOR_PHOTO_POOL[index % DOCTOR_PHOTO_POOL.length]
              };
            });
          }
        }
      } catch (oErr) {
        console.warn('Overpass Doctor API failed, falling back to DB:', oErr.message);
      }
    }

    // 3. Final fallback to Database (Replaces generateMockDoctors)
    if (doctors.length === 0) {
      provider = 'database';
      let dbQuery = {};
      const filterTerm = specialty || query;
      
      if (filterTerm) {
        const filterLower = filterTerm.toLowerCase();
        if (filterLower === 'general practitioner') {
           dbQuery = { specialty: { $regex: 'general|internal|family', $options: 'i' } };
        } else {
           dbQuery = { 
             $or: [
               { specialty: { $regex: filterTerm, $options: 'i' } },
               { name: { $regex: filterTerm, $options: 'i' } }
             ]
           };
        }
      }

      const dbDoctors = await Doctor.find(dbQuery);

      doctors = dbDoctors.map(doc => {
        const dist = calculateDistance(lat, lng, doc.lat, doc.lng);
        return {
          id: doc.id || doc._id.toString(),
          name: doc.name,
          specialty: doc.specialty,
          rating: doc.rating,
          user_ratings_total: doc.user_ratings_total,
          exp: doc.exp,
          available: doc.available,
          phone: doc.phone,
          address: doc.address,
          lat: doc.lat,
          lng: doc.lng,
          distanceKm: parseFloat(dist.toFixed(2)),
          distanceFormatted: `${dist.toFixed(1)} km`,
          photo: doc.photo || DOCTOR_PHOTO_POOL[Math.floor(Math.random() * DOCTOR_PHOTO_POOL.length)]
        };
      });
    }

    doctors.sort((a, b) => a.distanceKm - b.distanceKm);

    const payload = {
      status: 'OK',
      provider,
      userLocation: { lat, lng },
      radiusMeters: radius,
      total: doctors.length,
      results: doctors
    };

    doctorCache.set(cacheKey, { timestamp: Date.now(), data: payload });
    res.json(payload);

  } catch (error) {
    console.error('Error fetching nearby doctors:', error);
    res.status(500).json({ status: 'ERROR', message: error.message, results: [] });
  }
};

export const clearDoctorCache = () => doctorCache.clear();
