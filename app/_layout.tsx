import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{
        headerBackTitle: 'Back', // ← removes text next to back button everywhere
        title: "",
      }}>
        {/* Tabs as one screen */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false,  }} />
        {/* Stack-only screens */}
        <Stack.Screen name="medicine_info" options={{  }} />
        <Stack.Screen name="(settings_pages)" options={{ headerShown: true, }} />
      </Stack>
      <StatusBar style="dark" />
      {/* <Slot /> */}
    </>
  );
}