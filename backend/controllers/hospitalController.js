import fetch from 'node-fetch';
import Hospital from '../models/Hospital.js';
import { calculateDistance, getUniqueHospitalPhoto } from '../utils/helpers.js';

const hospitalCache = new Map();

export const getNearbyHospitals = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || 17.3850;
    const lng = parseFloat(req.query.lng) || 78.4867;
    const radius = parseInt(req.query.radius) || 5000; // in meters
    const query = req.query.query || '';
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}_${radius}_${query}`;
    if (hospitalCache.has(cacheKey)) {
      const cached = hospitalCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) {
        return res.json(cached.data);
      }
    }

    let hospitals = [];
    let provider = 'mock';

    // 1. Try Google Places API
    if (apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital${query ? `&keyword=${encodeURIComponent(query)}` : ''}&key=${apiKey}`;
        const googleRes = await fetch(url);
        const googleData = await googleRes.json();

        if (googleData.status === 'OK' && googleData.results) {
          provider = 'google_places';
          hospitals = googleData.results.map((item, index) => {
            const hLat = item.geometry.location.lat;
            const hLng = item.geometry.location.lng;
            const dist = calculateDistance(lat, lng, hLat, hLng);
            const photoRef = item.photos && item.photos.length > 0 ? item.photos[0].photo_reference : null;
            const isEmergency = item.types.includes('hospital') || (item.name && (item.name.toLowerCase().includes('emergency') || item.name.toLowerCase().includes('trauma')));

            return {
              id: item.place_id,
              name: item.name,
              type: isEmergency ? 'Emergency Hospital' : 'Medical Center',
              lat: hLat,
              lng: hLng,
              rating: item.rating || 4.5,
              user_ratings_total: item.user_ratings_total || 120,
              is24hr: item.opening_hours?.open_now ?? true,
              emergency: isEmergency,
              openNow: item.opening_hours?.open_now ?? true,
              address: item.vicinity || 'Address unavailable',
              phone: '+1 (555) 900-1234',
              photo: getUniqueHospitalPhoto(item.name, hLat, hLng, index, apiKey, photoRef),
              distanceKm: parseFloat(dist.toFixed(2)),
              distanceFormatted: `${dist.toFixed(1)} km`,
              vicinity: item.vicinity || 'Local District'
            };
          });
        }
      } catch (gErr) {
        console.warn('Google Places API fetch failed, falling back to Overpass/DB:', gErr.message);
      }
    }

    // 2. Overpass API fallback if Google returned 0 or no API key
    if (hospitals.length === 0) {
      try {
        const radiusKm = radius / 1000;
        const delta = radiusKm / 111.0;
        const bbox = `${lat - delta},${lng - delta},${lat + delta},${lng + delta}`;
        const overpassQuery = `[out:json][timeout:10];(node["amenity"="hospital"](${bbox});way["amenity"="hospital"](${bbox});node["amenity"="clinic"](${bbox}););out center 20;`;
        
        const overpassRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
        if (overpassRes.ok) {
          const overpassData = await overpassRes.json();
          if (overpassData.elements && overpassData.elements.length > 0) {
            provider = 'overpass_osm';
            hospitals = overpassData.elements.map((el, index) => {
              const hLat = el.lat || el.center?.lat;
              const hLng = el.lon || el.center?.lon;
              if (!hLat || !hLng) return null;

              const name = el.tags?.name || el.tags?.['name:en'] || `Medical Center #${index + 1}`;
              const dist = calculateDistance(lat, lng, hLat, hLng);
              const isEmergency = el.tags?.emergency === 'yes' || name.toLowerCase().includes('emergency') || name.toLowerCase().includes('hospital');

              return {
                id: `op-${el.id || index}`,
                name: name,
                type: el.tags?.amenity === 'hospital' ? (isEmergency ? 'Emergency Hospital' : 'General Hospital') : 'Medical Clinic',
                lat: hLat,
                lng: hLng,
                rating: parseFloat((4.0 + (index % 10) * 0.1).toFixed(1)),
                user_ratings_total: 80 + index * 35,
                is24hr: el.tags?.opening_hours === '24/7' || isEmergency,
                emergency: isEmergency,
                openNow: true,
                address: el.tags?.['addr:full'] || el.tags?.['addr:street'] ? `${el.tags['addr:street'] || ''} ${el.tags['addr:city'] || ''}` : 'Local Medical Zone',
                phone: el.tags?.phone || el.tags?.['contact:phone'] || '+1 (555) 012-3456',
                website: el.tags?.website || null,
                photo: getUniqueHospitalPhoto(name, hLat, hLng, index),
                distanceKm: parseFloat(dist.toFixed(2)),
                distanceFormatted: `${dist.toFixed(1)} km`,
                vicinity: el.tags?.['addr:suburb'] || 'Near Your Location'
              };
            }).filter(Boolean);
          }
        }
      } catch (oErr) {
        console.warn('Overpass API failed, using DB mock:', oErr.message);
      }
    }

    // 3. Final fallback to MongoDB Database (Replaces hardcoded generateMockHospitals)
    if (hospitals.length === 0) {
      provider = 'database';
      let dbQuery = {};
      if (query) {
        dbQuery = { 
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { type: { $regex: query, $options: 'i' } }
          ]
        };
      }
      
      const dbHospitals = await Hospital.find(dbQuery);
      
      hospitals = dbHospitals.map(h => {
        const dist = calculateDistance(lat, lng, h.lat, h.lng);
        return {
          id: h.id || h._id.toString(),
          name: h.name,
          type: h.type,
          lat: h.lat,
          lng: h.lng,
          rating: h.rating,
          user_ratings_total: h.user_ratings_total,
          is24hr: h.is24hr,
          emergency: h.emergency,
          openNow: h.openNow,
          address: h.address,
          phone: h.phone,
          website: h.website,
          photo: h.photo,
          vicinity: h.vicinity,
          distanceKm: parseFloat(dist.toFixed(2)),
          distanceFormatted: `${dist.toFixed(1)} km`
        };
      });
    }

    // Filter by radius, fallback to all hospitals sorted by distance if none in strict radius
    let filtered = hospitals.filter(h => h.distanceKm * 1000 <= radius * 2.5);
    if (filtered.length === 0 && hospitals.length > 0) {
      filtered = [...hospitals];
    }
    
    // Sort by distance ascending by default
    filtered.sort((a, b) => a.distanceKm - b.distanceKm);

    const payload = {
      status: 'OK',
      provider,
      userLocation: { lat, lng },
      radiusMeters: radius,
      total: filtered.length,
      results: filtered
    };

    hospitalCache.set(cacheKey, { timestamp: Date.now(), data: payload });
    res.json(payload);

  } catch (error) {
    console.error('Error fetching nearby hospitals:', error);
    res.status(500).json({ status: 'ERROR', message: error.message, results: [] });
  }
};

export const getHospitalAutocomplete = (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  if (!query || query.length < 2) {
    return res.json({ suggestions: [] });
  }

  // We can eventually pull this from DB as well by doing a distinct/regex query.
  // Keeping simple static list for now since autocomplete is fast and generic.
  const suggestions = [
    'City General Hospital',
    'Emergency Trauma Center',
    'St. Jude Medical Center',
    'Children Specialty Hospital',
    'Urgent Care Clinic',
    'Metro Cardiac Center',
    'Parkside Community Hospital'
  ].filter(s => s.toLowerCase().includes(query)).map(s => ({ text: s }));

  res.json({ suggestions });
};
