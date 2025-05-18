import { Stack } from 'expo-router';
import { ThemeProvider } from '../../context/theme_context';

export default function SettingsLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          title: '',
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}