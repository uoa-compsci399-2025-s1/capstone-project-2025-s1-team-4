import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeStyles {
  container: any;
  text: any;
  card: any;
}

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (mode: ThemeType) => void;
  textSize: number;
  setTextSize: (size: number) => void;
  themeStyles: ThemeStyles;
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

  return (
    <ThemeContext.Provider value={{ theme, setTheme, textSize, setTextSize: handleSetTextSize, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

const lightTheme: ThemeStyles = StyleSheet.create({
  container: { backgroundColor: '#f0f8ff' },
  text: { color: '#336699' },
  card: { backgroundColor: '#ffffff' }, 
});

const darkTheme: ThemeStyles = StyleSheet.create({
  container: { backgroundColor: '#343635' },
  text: { color: '#eeeeee' },
  card: { backgroundColor: '#7f7f7f' }, 
});

