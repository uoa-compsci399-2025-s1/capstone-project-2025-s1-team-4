import { Stack, Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      {/* Global status bar config */}
      <StatusBar style="auto" /> {/* or "light" if your default background is dark */}

      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="camera" options={{ title: 'Camera' }} />
        <Stack.Screen name="scan_result" options={{ title: 'Scan results' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}