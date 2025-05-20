import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Slider from '@react-native-community/slider'; 
import { useTheme } from '../../context/theme_context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AppearanceTab = () => {
  const { theme, setTheme, textSize, setTextSize, themeStyles } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, themeStyles.container]}>
      
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={40} color="#336699" />
      </TouchableOpacity>

      {/* Page Header */}
      <View style={styles.pageTitleWrapper}>
        <Text style={[styles.pageTitleText, themeStyles.text]}>
          Appearance
        </Text>
      </View>

      {/* Heading */}
      <Text style={[styles.heading, themeStyles.text, { fontSize: textSize + 4 }]}>
        Theme
      </Text>

      {/* Theme Toggle Options */}
      <View style={styles.settingCard}>
        {['light', 'dark', 'system'].map((mode, index, arr) => {
          const isLast = index === arr.length - 1;
          const isSelected = theme === mode;

          return (
            <TouchableOpacity
              key={mode}
              onPress={() => setTheme(mode as 'light' | 'dark' | 'system')}
              activeOpacity={0.7}
              style={[
                styles.settingRow,
                !isLast && { borderBottomWidth: 1, borderBottomColor: '#eee' }
              ]}
            >
              <Text
                style={[
                  styles.settingText,
                  isSelected && { fontWeight: 'bold', color: '#336699' }
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
              <Ionicons
                name="checkmark-sharp"
                size={18}
                color={isSelected ? '#336699' : 'transparent'}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Heading */}
      <Text style={[styles.heading, themeStyles.text, { fontSize: textSize + 4 }]}>
        Font Size
      </Text>

{/* Font Slider Card */}
<View style={styles.settingCard}>
  <View style={styles.sliderContent}>
    <Text style={[styles.label, themeStyles.text, { fontSize: textSize }]}>
      Font Size: {textSize}
    </Text>
    <Slider
      style={styles.slider}
      minimumValue={12}
      maximumValue={24}
      step={1}
      value={textSize}
      onValueChange={setTextSize}
      minimumTrackTintColor="#336699"
      maximumTrackTintColor="000000"
    />
  </View>
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff', 
    flexGrow: 1, 
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#336699',
    marginBottom: 10,
    marginTop: -7,
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
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 23,
  },
  pageTitleText: {
    fontSize: 40,
    color: '#336699',
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 16,
    zIndex: 1,
  },
  themeCard: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 30,
    marginTop: 10,
    elevation: 3,
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 12,
    marginBottom: 30,
    elevation: 3,
  },
settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginHorizontal: -12,
    paddingHorizontal: 12,
  },
settingText: {
    fontSize: 17,
    color: '#336699',
  },
sliderContent: {
  paddingVertical: 8,
  paddingHorizontal: 4,
}
});

export default AppearanceTab;
