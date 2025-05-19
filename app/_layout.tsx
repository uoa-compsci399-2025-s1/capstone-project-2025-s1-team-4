import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../context/theme_context';

function InnerLayout() {
  const { theme } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerBackTitle: 'Back',
          title: '',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="medicine_info" options={{ headerShown: false }} />
        <Stack.Screen name="(settings_pages)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}