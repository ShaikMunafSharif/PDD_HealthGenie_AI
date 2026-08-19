import { Stack } from 'expo-router';

export default function AnalyticsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="progress" />
      <Stack.Screen name="streaks" />
      <Stack.Screen name="health-report" />
    </Stack>
  );
}
