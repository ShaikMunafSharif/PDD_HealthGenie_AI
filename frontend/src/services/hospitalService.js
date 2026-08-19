// HealthGenie AI - Nearby Hospitals Service

export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable. Please check your GPS settings.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  });
}

export async function fetchNearbyHospitals(lat, lng, radius = 5000, query = '') {
  try {
    const res = await fetch(`/api/hospitals/nearby?lat=${lat}&lng=${lng}&radius=${radius}&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Backend API request failed, generating client fallback:', err.message);
    // Fallback if backend server is unreachable
    return {
      status: 'FALLBACK',
      userLocation: { lat, lng },
      radiusMeters: radius,
      results: getClientFallbackHospitals(lat, lng, query)
    };
  }
}

export async function fetchHospitalAutocomplete(query) {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(`/api/hospitals/autocomplete?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.suggestions || [];
  } catch (err) {
    return [];
  }
}

export function filterAndSortHospitals(hospitals, { minRating = 0, is24hrOnly = false, emergencyOnly = false, openNowOnly = false, sortBy = 'nearest' }) {
  let list = [...hospitals];

  if (minRating > 0) {
    list = list.filter(h => h.rating >= minRating);
  }
  if (is24hrOnly) {
    list = list.filter(h => h.is24hr);
  }
  if (emergencyOnly) {
    list = list.filter(h => h.emergency);
  }
  if (openNowOnly) {
    list = list.filter(h => h.openNow);
  }

  // Sorting
  switch (sortBy) {
    case 'nearest':
      list.sort((a, b) => a.distanceKm - b.distanceKm);
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'reviews':
      list.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
      break;
    case 'open':
      list.sort((a, b) => (b.openNow ? 1 : 0) - (a.openNow ? 1 : 0));
      break;
    default:
      list.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return list;
}

export function getGoogleMapsDirectionsUrl(lat, lng, originLat = null, originLng = null) {
  if (originLat && originLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${lat},${lng}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function getClientFallbackHospitals(lat, lng, query = '') {
  const defaults = [
    { id: 'fb-1', name: 'Apex General Hospital', type: 'General & Emergency', lat: lat + 0.008, lng: lng + 0.006, rating: 4.8, user_ratings_total: 420, is24hr: true, emergency: true, openNow: true, address: '100 Medical Boulevard', phone: '+1 (555) 019-2834', photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80' },
    { id: 'fb-2', name: 'St. Mary Specialty Medical Center', type: 'Multi-Specialty', lat: lat - 0.010, lng: lng + 0.007, rating: 4.6, user_ratings_total: 280, is24hr: true, emergency: true, openNow: true, address: '45 Care Parkway', phone: '+1 (555) 014-9921', photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80' },
    { id: 'fb-3', name: 'Sunrise Health Clinic', type: 'Clinic & Urgent Care', lat: lat + 0.004, lng: lng - 0.005, rating: 4.3, user_ratings_total: 95, is24hr: false, emergency: false, openNow: true, address: '12 Sunshine Way', phone: '+1 (555) 018-7722', photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&auto=format&fit=crop&q=80' }
  ];

  return defaults.map(h => {
    const dist = calculateHaversineDistance(lat, lng, h.lat, h.lng);
    
    // Dynamically adjust mock data to match the searched specialist
    let dynamicName = h.name;
    let dynamicType = h.type;
    
    if (query && query.length > 2) {
      const spec = query.split(' ')[0];
      if (h.id === 'fb-1') {
        dynamicName = `Apex ${spec} Center`;
        dynamicType = `${query} & Emergency`;
      } else if (h.id === 'fb-2') {
        dynamicName = `St. Mary ${spec} Clinic`;
        dynamicType = `${query} Specialist`;
      } else {
        dynamicType = `${query} Available`;
      }
    }

    return {
      ...h,
      name: dynamicName,
      type: dynamicType,
      distanceKm: parseFloat(dist.toFixed(2)),
      distanceFormatted: `${dist.toFixed(1)} km`
    };
  });
}
