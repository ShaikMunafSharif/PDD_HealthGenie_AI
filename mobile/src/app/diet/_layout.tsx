import { Stack } from 'expo-router';

export default function DietLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="plan" />
      <Stack.Screen name="meal-details" />
    </Stack>
  );
}
