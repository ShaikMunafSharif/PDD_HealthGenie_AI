import { Stack } from 'expo-router';

export default function SymptomsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="details" />
      <Stack.Screen name="processing" options={{ animation: 'fade' }} />
      <Stack.Screen name="results" options={{ animation: 'fade' }} />
    </Stack>
  );
}
