import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import Slider from '@react-native-community/slider';

export default function AppearanceScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState(16);
  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.subtitle, themeStyles.text]}>Appearance Settings</Text>
      <View style={styles.section}>
        <Text style={[styles.label, themeStyles.text]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={() => setIsDarkMode(!isDarkMode)}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, themeStyles.text]}>Text Size: {textSize}</Text>
        <Slider
          style={{ width: 200 }}
          minimumValue={12}
          maximumValue={30}
          step={1}
          value={textSize}
          onValueChange={setTextSize}
        />
        <Text style={[themeStyles.text, { fontSize: textSize, marginTop: 20 }]}>
          Sample Text with size {textSize}
        </Text>
      </View>
    </View>
  );
}

const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: '#f0f8ff',
  },
  text: {
    color: '#333',
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: '#1c1c1c',
  },
  text: {
    color: '#f8f8f8',
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
