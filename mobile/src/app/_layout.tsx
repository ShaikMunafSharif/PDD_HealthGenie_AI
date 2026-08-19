import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../store/healthStore';
import { StatusBar } from 'expo-status-bar';

import '../global.css';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, hasCompletedOnboarding, hasCompletedSetup } = useAuthStore();

  useEffect(() => {
    if (!segments || (segments as any).length === 0) return;

    const firstSegment = segments[0] as string;
    const inAuthGroup = firstSegment === '(auth)';
    const inTabsGroup = firstSegment === '(tabs)';

    // Allow index splash screen to handle initial splash animation and navigation
    if (firstSegment === 'index') return;

    // Routing Logic based on Zustand persistent state
    if (!hasCompletedOnboarding && firstSegment !== 'onboarding') {
      router.replace('/onboarding');
    } else if (hasCompletedOnboarding && !isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !hasCompletedSetup && !firstSegment.startsWith('setup')) {
      router.replace('/setup-profile');
    } else if (isAuthenticated && hasCompletedSetup && inAuthGroup) {
      router.replace('/(tabs)/dashboard');
    }
  }, [isAuthenticated, hasCompletedOnboarding, hasCompletedSetup, segments]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="setup-profile" options={{ headerShown: false }} />
        <Stack.Screen name="setup-medical-history" options={{ headerShown: false }} />
        <Stack.Screen name="setup-allergies" options={{ headerShown: false }} />
        <Stack.Screen name="symptoms" options={{ headerShown: false }} />
        <Stack.Screen name="water" options={{ headerShown: false }} />
        <Stack.Screen name="first-aid" options={{ headerShown: false }} />
        <Stack.Screen name="health-score" options={{ headerShown: false }} />
        <Stack.Screen name="explore" options={{ headerShown: false }} />
        <Stack.Screen name="diet" options={{ headerShown: false }} />
        <Stack.Screen name="exercise" options={{ headerShown: false }} />
        <Stack.Screen name="doctor" options={{ headerShown: false }} />
        <Stack.Screen name="emergency" options={{ headerShown: false }} />
        <Stack.Screen name="women" options={{ headerShown: false }} />
        <Stack.Screen name="pregnancy" options={{ headerShown: false }} />
        <Stack.Screen name="analytics" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
