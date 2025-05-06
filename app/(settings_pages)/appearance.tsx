import React from 'react';
import { View, Text, Switch, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider'; // Ensure this is installed
import { useTheme } from '../../ThemeContext';

const AppearanceTab = () => {
  const { theme, toggleTheme, textSize, setTextSize, themeStyles } = useTheme();

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.heading, themeStyles.text, { fontSize: textSize + 4 }]}>
        Appearance Settings
      </Text>

      {/* Theme Toggle */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, themeStyles.text, { fontSize: textSize }]}>
          Dark Mode
        </Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          thumbColor={theme === 'dark' ? '#fff' : '#000'}
          trackColor={{ false: '#ccc', true: '#444' }}
        />
      </View>

      {/* Text Size Slider */}
      <View style={styles.sliderBlock}>
        <Text style={[styles.label, themeStyles.text, { fontSize: textSize }]}>
          Text Size: {textSize}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={12}
          maximumValue={24}
          step={1}
          value={textSize}
          onValueChange={setTextSize}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor={Platform.OS === 'android' ? '#1EB1FC' : undefined}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  label: {
    flex: 1,
  },
  sliderBlock: {
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default AppearanceTab;