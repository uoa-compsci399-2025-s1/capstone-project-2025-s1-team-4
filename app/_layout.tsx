import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <Stack>
        {/* Tabs as one screen */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Stack-only screens */}
        <Stack.Screen name="medicine_info" options={{ title: 'Medicine Info' }} />
      </Stack>
      <StatusBar style="dark" />
      {/* <Slot /> */}
    </>
  );
}