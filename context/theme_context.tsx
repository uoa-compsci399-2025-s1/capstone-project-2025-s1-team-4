import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeStyles {
  container: any;
  text: any;
  transparentText: any;
  card: any;
  bodyText: any;
}

interface ThemeColors {
  textColor: string;
  iconColor: string;
  dark: string;
  med: string;
  medLight: string;
  light: string;
  transparentTextColor: string;
}

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (mode: ThemeType) => void;
  textSize: number;
  setTextSize: (size: number) => void;
  themeStyles: ThemeStyles;
  themeColors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [textSize, setTextSize] = useState<number>(16);
  const systemColorScheme = useColorScheme(); // 'light' or 'dark'

  useEffect(() => {
    const loadPrefs = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      const storedTextSize = await AsyncStorage.getItem('textSize');
      if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
        setThemeState(storedTheme);
      }
      if (storedTextSize && !isNaN(Number(storedTextSize))) {
        setTextSize(Number(storedTextSize));
      }
    };
    loadPrefs();
  }, []);

  const setTheme = async (mode: ThemeType) => {
    setThemeState(mode);
    await AsyncStorage.setItem('theme', mode);
  };

  const handleSetTextSize = async (size: number) => {
    setTextSize(size);
    await AsyncStorage.setItem('textSize', size.toString());
  };

  const resolvedTheme = theme === 'system' ? (systemColorScheme || 'light') : theme;
  const themeStyles = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const themeColors = resolvedTheme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, textSize, setTextSize: handleSetTextSize, themeStyles, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

const lightTheme:
  ThemeStyles = StyleSheet.create({
    container: { backgroundColor: '#f0f8ff' },
    text: { color: '#336699' },
    transparentText: { color: '#336699' },
    card: { backgroundColor: '#ffffff' },
    bodyText: { color: '#4a4a4a' },
  });

const lightColors: ThemeColors = {
  textColor: '#336699',
  iconColor: '#336699',
  dark: '#4f4f4f',
  med: '#336699',
  medLight: '#fff',
  light: '#336699',
  transparentTextColor: '#ababab',
};

const darkTheme: ThemeStyles = StyleSheet.create({
  container: { backgroundColor: '#1A2130' },
  text: { color: '#c5e1fa' },
  transparentText: { color: '#ffffff' },
  card: { backgroundColor: '#5B6174' },
  bodyText: { color: '#ffffff' },
});

const darkColors: ThemeColors = {
  textColor: '#c5e1fa',
  iconColor: '#c5e1fa',
  dark: '#ffffff',
  med: '#c5e1fa',
  medLight: '#5B6174',
  light: '#c5e1fa',
  transparentTextColor: '#ffffff',
};

