import { Stack } from 'expo-router';

export default function EmergencyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="sos-confirm" options={{ presentation: 'modal' }} />
      <Stack.Screen name="hospitals" />
      <Stack.Screen name="contacts" />
      <Stack.Screen name="add-contact" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
