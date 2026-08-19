import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, TextInput, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, MapPin, Phone, Clock, Star, Navigation, AlertCircle, Compass, RefreshCw } from 'lucide-react-native';
import HospitalMap from '../../components/HospitalMap';
import { GlassCard, GlassButton } from '../../components/ui/Components';
import { getUserLocation, fetchNearbyHospitals, filterAndSortHospitals, openDirections } from '../../services/hospitalService';

const { width } = Dimensions.get('window');

export default function EmergencyHospitals() {
  const router = useRouter();

  const [location, setLocation] = useState({ lat: 17.3850, lng: 78.4867 });
  const [hasLocation, setHasLocation] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [radius, setRadius] = useState(5000);
  
  useEffect(() => {
    requestLiveLocation();
  }, []);

  useEffect(() => {
    loadHospitals();
  }, [location, radius, searchQuery]);

  const requestLiveLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const pos = await getUserLocation();
      setLocation({ lat: pos.lat, lng: pos.lng });
      setHasLocation(true);
    } catch (err: any) {
      console.warn('GPS Error:', err.message);
      setLocationError(err.message);
      setHasLocation(false);
    } finally {
      setLocationLoading(false);
    }
  };

  const loadHospitals = async () => {
    setDataLoading(true);
    try {
      const res = await fetchNearbyHospitals(location.lat, location.lng, radius, searchQuery);
      setHospitals(res.results || []);
    } catch (err) {
      console.warn('Failed to load hospitals', err);
    } finally {
      setDataLoading(false);
    }
  };

  const filteredHospitals = filterAndSortHospitals(hospitals, { sortBy: 'nearest' });

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>GPS LOCATOR</Text>
          <Text style={styles.title} numberOfLines={1}>Nearby Hospitals</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        
        {locationError && (
          <GlassCard hover={false} style={styles.errorBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <AlertCircle size={20} color="#EF4444" />
              <View>
                <Text style={styles.errorTitle}>GPS Location Access Required</Text>
                <Text style={styles.errorDesc}>{locationError} Showing fallback area.</Text>
              </View>
            </View>
            <TouchableOpacity onPress={requestLiveLocation} style={styles.retryBtn}>
              <RefreshCw size={14} color="#EF4444" />
            </TouchableOpacity>
          </GlassCard>
        )}

        <View style={styles.mapContainer}>
          <HospitalMap location={location} filteredHospitals={filteredHospitals} />
          
          <TouchableOpacity onPress={requestLiveLocation} style={styles.locateBtn}>
            {locationLoading ? <ActivityIndicator size="small" color="#2563EB" /> : <Compass size={20} color="#2563EB" />}
          </TouchableOpacity>
        </View>

        <View style={styles.controlsBar}>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search hospitals..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.listContainer}>
          {dataLoading ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
          ) : filteredHospitals.map((h, i) => (
            <Animated.View key={h.id} entering={FadeInUp.delay(i * 100)}>
              <GlassCard hover={false} style={styles.hospitalCard}>
                <View style={styles.hospitalRow}>
                  <Image source={{ uri: h.photo }} style={styles.hospitalImg} />
                  <View style={styles.hospitalInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.hName} numberOfLines={1}>{h.name}</Text>
                      {h.emergency && (
                        <View style={styles.emergencyBadge}>
                          <Text style={styles.emergencyBadgeText}>EMERGENCY</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.hType}>{h.type}</Text>
                    
                    <View style={styles.hStats}>
                      <View style={styles.statItem}>
                        <MapPin size={12} color="#2563EB" />
                        <Text style={[styles.statText, { color: '#2563EB' }]}>{h.distanceFormatted}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Star size={12} color="#D97706" />
                        <Text style={[styles.statText, { color: '#D97706' }]}>{h.rating}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Clock size={12} color={h.openNow ? '#10B981' : '#EF4444'} />
                        <Text style={[styles.statText, { color: h.openNow ? '#10B981' : '#EF4444' }]}>
                          {h.is24hr ? '24/7' : (h.openNow ? 'Open' : 'Closed')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.hospitalActions}>
                  {h.phone && (
                    <GlassButton style={styles.callBtn}>
                      <Phone size={14} color="#10B981" />
                      <Text style={{ color: '#10B981', fontWeight: '700', fontSize: 13, marginLeft: 6 }}>Call</Text>
                    </GlassButton>
                  )}
                  <GlassButton variant="primary" style={{ flex: 1, paddingVertical: 10 }} onPress={() => openDirections(h.lat, h.lng)}>
                    <Navigation size={14} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13, marginLeft: 6 }}>Directions</Text>
                  </GlassButton>
                </View>
              </GlassCard>
            </Animated.View>
          ))}
        </View>

      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  backBtn: {
    padding: 8,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    padding: 16,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
  },
  errorDesc: {
    fontSize: 11,
    color: '#B91C1C',
  },
  retryBtn: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locateBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  customMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  customMarkerEmergency: {
    backgroundColor: '#EF4444',
  },
  controlsBar: {
    marginBottom: 20,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    fontSize: 14,
    color: '#111827',
  },
  listContainer: {
    gap: 16,
    paddingBottom: 40,
  },
  hospitalCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  hospitalRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  hospitalImg: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  hospitalInfo: {
    flex: 1,
  },
  hName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  emergencyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 6,
  },
  emergencyBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#EF4444',
  },
  hType: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 8,
  },
  hStats: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    fontWeight: '600',
  },
  hospitalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  callBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    flex: 0.5,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
