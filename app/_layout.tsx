import { Stack } from "expo-router";
import Ionicons from '@expo/vector-icons'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="camera" options={{ title: 'Camera' }} />
    </Stack>
  );
}
