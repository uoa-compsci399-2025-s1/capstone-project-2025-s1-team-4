import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from '../context/theme_context';
import SplashScreen from '../app/(tabs)/splash_page';

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
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
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
  );
}