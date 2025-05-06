import React, { createContext, useContext, useState } from 'react';
import { StyleSheet } from 'react-native';

type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  textSize: number;
  setTextSize: (size: number) => void;
  themeStyles: any;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [textSize, setTextSize] = useState<number>(16);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const themeStyles = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, textSize, setTextSize, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: '#f0f8ff',
  },
  text: {
    color: '#336699',
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: '#1c1c1c',
  },
  text: {
    color: '#f8f8f8',
  },
});