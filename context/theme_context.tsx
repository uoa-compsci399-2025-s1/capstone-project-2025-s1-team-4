import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark';

interface ThemeStyles {
  container: any;
  text: any;
  card: any;
}

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  textSize: number;
  setTextSize: (size: number) => void;
  themeStyles: ThemeStyles;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [textSize, setTextSize] = useState<number>(16);

  useEffect(() => {
    const loadPrefs = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      const storedTextSize = await AsyncStorage.getItem('textSize');
      if (storedTheme === 'dark' || storedTheme === 'light') setTheme(storedTheme);
      if (storedTextSize && !isNaN(Number(storedTextSize))) setTextSize(Number(storedTextSize));
    };
    loadPrefs();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const handleSetTextSize = async (size: number) => {
    setTextSize(size);
    await AsyncStorage.setItem('textSize', size.toString());
  };

  const themeStyles = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, textSize, setTextSize: handleSetTextSize, themeStyles }}>
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
  container: { backgroundColor: '#07141f' },
  text: { color: '#d8eaff' },
  card: { backgroundColor: '#1e2a36' }, 
});