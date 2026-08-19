import { Stack } from 'expo-router';

export default function ExerciseLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="recommendations" />
      <Stack.Screen name="details" />
      <Stack.Screen name="pain-relief" />
    </Stack>
  );
}
