import { Stack, Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home'}} />
      <Stack.Screen name="camera" options={{ title: 'Camera' }} />
      <Stack.Screen name ="scan_result" options={{ title: 'Scan results'}} />
      <Stack.Screen name = "(tabs)" options={{ headerShown: false}} />
    </Stack>
  );
}