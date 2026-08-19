import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Compass } from 'lucide-react-native';

export default function HospitalMap({ location, filteredHospitals }: any) {
  return (
    <View style={styles.mapWeb}>
      <Compass size={36} color="#2563EB" />
      <Text style={{ marginTop: 10, color: '#1E293B', fontWeight: '700', fontSize: 14, textAlign: 'center' }}>
        Interactive GPS Hospital Map
      </Text>
      <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4, textAlign: 'center' }}>
        {filteredHospitals?.length || 0} nearby medical facilities detected around your location
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWeb: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
