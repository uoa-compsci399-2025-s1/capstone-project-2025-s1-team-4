import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import SplashScreen from '../app/(tabs)/splash_page';
import { ThemeProvider, useTheme } from '../context/theme_context';

function InnerLayout() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerBackTitle: 'Back',
          title: '',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {isReady ? <InnerLayout /> : <SplashScreen />}
    </ThemeProvider>
  )}