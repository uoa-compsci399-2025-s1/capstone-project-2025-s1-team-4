/**
* Top-level layout file: propagates custom font across app, controls
* header visibility (currently OFF), themes tab bar. Also controls
* splash screen timing for Android.iOS. 
*/

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import SplashScreen from '../app/(tabs)/splash_page';
import { ThemeProvider, useTheme } from '../context/theme_context';
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';

function InnerLayout() {
  const { resolvedTheme } = useTheme();
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    });

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
