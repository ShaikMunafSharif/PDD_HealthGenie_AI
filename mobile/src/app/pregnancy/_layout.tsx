import { Stack } from 'expo-router';

export default function PregnancyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="trimester" />
      <Stack.Screen name="weekly-tips" />
      <Stack.Screen name="diet" />
      <Stack.Screen name="exercise" />
      <Stack.Screen name="doctor-visits" />
    </Stack>
  );
}
