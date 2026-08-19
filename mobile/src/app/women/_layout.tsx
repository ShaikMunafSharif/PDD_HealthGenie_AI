import { Stack } from 'expo-router';

export default function WomenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="period-tracker" />
      <Stack.Screen name="period-insights" />
      <Stack.Screen name="pcos-care" />
      <Stack.Screen name="skin-care" />
      <Stack.Screen name="diet" />
    </Stack>
  );
}
