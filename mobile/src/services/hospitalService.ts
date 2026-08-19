import * as Location from 'expo-location';
import { Platform, Linking } from 'react-native';
import { getBaseUrl } from './api';

export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getUserLocation() {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      try {
        let lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown && lastKnown.coords) {
          return {
            lat: lastKnown.coords.latitude,
            lng: lastKnown.coords.longitude,
            accuracy: lastKnown.coords.accuracy
          };
        }
      } catch (e) {}

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      if (location && location.coords) {
        return {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          accuracy: location.coords.accuracy
        };
      }
    }
  } catch (err) {
    console.warn('GPS position acquisition error, using fallback location:', err);
  }

  // Fallback default coordinates
  return { lat: 17.3850, lng: 78.4867, accuracy: 100 };
}

export async function fetchNearbyHospitals(lat: number, lng: number, radius = 10000, query = '') {
  try {
    const res = await fetch(`${getBaseUrl()}/hospitals/nearby?lat=${lat}&lng=${lng}&radius=${radius}&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      data.results = getClientFallbackHospitals(lat, lng, query);
    }
    return data;
  } catch (err: any) {
    console.warn('Backend API request failed, generating client fallback:', err.message);
    return {
      status: 'FALLBACK',
      userLocation: { lat, lng },
      radiusMeters: radius,
      results: getClientFallbackHospitals(lat, lng, query)
    };
  }
}

export function filterAndSortHospitals(hospitals: any[], { minRating = 0, is24hrOnly = false, emergencyOnly = false, openNowOnly = false, sortBy = 'nearest' }) {
  let list = [...hospitals];

  if (minRating > 0) list = list.filter(h => h.rating >= minRating);
  if (is24hrOnly) list = list.filter(h => h.is24hr);
  if (emergencyOnly) list = list.filter(h => h.emergency);
  if (openNowOnly) list = list.filter(h => h.openNow);

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

export function openDirections(lat: number, lng: number) {
  const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
  const latLng = `${lat},${lng}`;
  const label = 'Hospital';
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`
  });

  if (url) {
    Linking.openURL(url);
  }
}

function getClientFallbackHospitals(lat: number, lng: number, query = '') {
  const defaults = [
    { id: 'fb-1', name: 'Apex General & Emergency Hospital', type: 'General & Emergency', lat: lat + 0.0025, lng: lng + 0.0018, rating: 4.8, user_ratings_total: 420, is24hr: true, emergency: true, openNow: true, address: '100 Medical Center Way', phone: '+1 (555) 019-2834', photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80' },
    { id: 'fb-2', name: 'St. Mary Specialty Medical Center', type: 'Multi-Specialty Hospital', lat: lat - 0.0030, lng: lng + 0.0022, rating: 4.6, user_ratings_total: 280, is24hr: true, emergency: true, openNow: true, address: '45 Care Parkway', phone: '+1 (555) 014-9921', photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80' },
    { id: 'fb-3', name: 'Sunrise Urgent Care & Emergency', type: 'Clinic & Emergency', lat: lat + 0.0018, lng: lng - 0.0028, rating: 4.4, user_ratings_total: 195, is24hr: true, emergency: true, openNow: true, address: '12 Health Boulevard', phone: '+1 (555) 018-7722', photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&auto=format&fit=crop&q=80' }
  ];

  return defaults.map(h => {
    const dist = calculateHaversineDistance(lat, lng, h.lat, h.lng);
    return {
      ...h,
      distanceKm: parseFloat(dist.toFixed(2)),
      distanceFormatted: `${dist.toFixed(1)} km`
    };
  }).filter(h => {
    if (!query) return true;
    const qLower = query.toLowerCase();
    return h.name.toLowerCase().includes(qLower) || h.type.toLowerCase().includes(qLower);
  });
}
