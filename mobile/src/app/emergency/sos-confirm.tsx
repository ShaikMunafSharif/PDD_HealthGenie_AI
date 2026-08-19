import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { AlertTriangle, X, Siren, Phone } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../../components/ui/Components';
import { useEmergencyStore } from '../../store/healthStore';

export default function SOSConfirm() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const contacts = useEmergencyStore((s: any) => s.contacts);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
              withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
          )
        }
      ]
    };
  });

  const handleConfirm = () => setConfirmed(true);
  const handleCancel = () => {
    setConfirmed(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      {!confirmed ? (
        <Animated.View entering={FadeInUp} style={styles.cardWrapper}>
          <GlassCard hover={false} style={styles.card}>
            <Animated.View style={[styles.iconBoxWarning, pulseStyle]}>
              <AlertTriangle size={36} color="#FFFFFF" />
            </Animated.View>
            <Text style={styles.titleWarning}>Confirm SOS Alert</Text>
            <Text style={styles.desc}>This will notify all your emergency contacts with your current location. Are you sure?</Text>
            
            <View style={styles.btnRow}>
              <GlassButton onPress={handleCancel} style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <X size={16} color="#111827" />
                  <Text style={{ fontWeight: '600' }}>Cancel</Text>
                </View>
              </GlassButton>
              <GlassButton variant="danger" onPress={handleConfirm} style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Siren size={16} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>SEND SOS</Text>
                </View>
              </GlassButton>
            </View>
          </GlassCard>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInUp} style={styles.cardWrapper}>
          <GlassCard hover={false} style={styles.cardActive}>
            <Animated.View style={[styles.iconBoxActive, pulseStyle]}>
              <Siren size={40} color="#FFFFFF" />
            </Animated.View>
            <Text style={styles.titleActive}>SOS ACTIVE</Text>
            <Text style={styles.desc}>Emergency alert sent to {contacts.length} contacts</Text>
            
            <View style={styles.contactsList}>
              {contacts.map(c => (
                <View key={c.id} style={styles.contactRow}>
                  <Phone size={14} color="#EF4444" />
                  <Text style={styles.contactText}>{c.name} — Notified ✓</Text>
                </View>
              ))}
            </View>

            <GlassButton onPress={handleCancel} fullWidth style={{ marginTop: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <X size={16} color="#111827" />
                <Text style={{ fontWeight: '700' }}>Cancel SOS</Text>
              </View>
            </GlassButton>
          </GlassCard>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    borderRadius: 24,
  },
  cardActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    borderRadius: 24,
  },
  iconBoxWarning: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  iconBoxActive: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  titleWarning: {
    fontSize: 22,
    fontWeight: '800',
    color: '#C2410C',
    marginBottom: 10,
  },
  titleActive: {
    fontSize: 24,
    fontWeight: '800',
    color: '#B91C1C',
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  contactsList: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  }
});
