import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut, withRepeat, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useSymptomStore } from '../../store/healthStore';

export default function SymptomProcessing() {
  const router = useRouter();
  const { selectedSymptoms } = useSymptomStore();
  
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false);

    const timer = setTimeout(() => {
      router.replace('/symptoms/results');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }]
    };
  });

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      
      <View style={styles.spinnerContainer}>
        <Animated.View style={[styles.spinnerRing1, animatedStyle]} />
        <Animated.View style={[styles.spinnerRing2, animatedStyle]} />
      </View>
      
      <Text style={styles.text}>Connecting to HealthGenie AI...</Text>

      <View style={styles.tagGrid}>
        {selectedSymptoms.slice(0, 5).map((s: any, i: number) => (
          <View key={s} style={styles.tag}>
            <Text style={styles.tagText}>{s}</Text>
          </View>
        ))}
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  spinnerContainer: {
    width: 80,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  spinnerRing1: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#38BDF8',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    opacity: 0.8,
  },
  spinnerRing2: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#818CF8',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    opacity: 0.8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#38BDF8',
    marginBottom: 40,
    fontFamily: 'Inter',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    maxWidth: 300,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38BDF8',
  }
});
