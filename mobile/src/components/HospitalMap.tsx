import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';

export default function HospitalMap({ location, filteredHospitals }: any) {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={styles.map}
      region={{
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {filteredHospitals.map((h: any) => (
        <Marker
          key={h.id}
          coordinate={{ latitude: h.lat, longitude: h.lng }}
          title={h.name}
          description={`${h.type} • ${h.distanceFormatted}`}
        >
          <View style={[styles.customMarker, h.emergency && styles.customMarkerEmergency]}>
            <Text style={{ fontSize: 16 }}>{h.emergency ? '🚑' : '🏥'}</Text>
          </View>
          <Callout>
            <View style={{ width: 200, padding: 8 }}>
              <Text style={{ fontWeight: '700', fontSize: 14 }}>{h.name}</Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{h.type}</Text>
              <Text style={{ fontSize: 12, color: '#2563EB', marginTop: 2, fontWeight: '700' }}>{h.distanceFormatted}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
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
});
