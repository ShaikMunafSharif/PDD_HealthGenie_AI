import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSpring, 
  withDelay, 
  Easing,
  withSequence
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { useAuthStore } from '../store/healthStore';

const Particle = ({ delay, color, top, left }: any) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.1);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(delay, withRepeat(withSequence(withTiming(-30, { duration: 1500 }), withTiming(0, { duration: 1500 })), -1, true));
    opacity.value = withDelay(delay, withRepeat(withSequence(withTiming(0.5, { duration: 1500 }), withTiming(0.1, { duration: 1500 })), -1, true));
    scale.value = withDelay(delay, withRepeat(withSequence(withTiming(1.5, { duration: 1500 }), withTiming(1, { duration: 1500 })), -1, true));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{
      position: 'absolute',
      top, left,
      width: 4, height: 4,
      borderRadius: 2,
      backgroundColor: color,
    }, style]} />
  );
};

export default function Splash() {
  const router = useRouter();
  const { hasCompletedOnboarding, isAuthenticated, hasCompletedSetup } = useAuthStore();
  
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const ringRotate = useSharedValue(0);
  const barX = useSharedValue(-100);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 90 });
    logoOpacity.value = withTiming(1, { duration: 800 });
    ringRotate.value = withRepeat(withTiming(360, { duration: 6000, easing: Easing.linear }), -1, false);
    barX.value = withRepeat(withTiming(100, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);

    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else if (!isAuthenticated) {
        router.replace('/(auth)/login');
      } else if (!hasCompletedSetup) {
        router.replace('/setup-profile');
      } else {
        router.replace('/(tabs)/dashboard');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotate.value}deg` }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: barX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Background Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Particle 
          key={i} 
          delay={i * 200} 
          color={i % 3 === 0 ? '#00F5FF' : i % 3 === 1 ? '#39FF14' : '#EC4899'}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
        />
      ))}

      {/* Logo Orb */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <View style={styles.orb}>
          <Sparkles size={48} color="#020510" />
        </View>

        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.ring,
              {
                width: 140 + i * 30,
                height: 140 + i * 30,
                borderRadius: (140 + i * 30) / 2,
                borderColor: `rgba(0, 245, 255, ${0.15 - i * 0.04})`,
              },
              ringStyle
            ]}
          />
        ))}
      </Animated.View>

      {/* Title */}
      <Animated.Text style={[styles.title, logoStyle]}>
        HealthGenie AI
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, logoStyle]}>
        Your Personal Health Partner
      </Animated.Text>

      {/* Loading Bar */}
      <View style={styles.loaderContainer}>
        <Animated.View style={[styles.loaderBar, barStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020510',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  orb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#00F5FF',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#00F5FF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
    width: 200,
    height: 3,
    backgroundColor: 'rgba(100, 180, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderBar: {
    width: '50%',
    height: '100%',
    backgroundColor: '#00F5FF',
    borderRadius: 2,
  }
});
