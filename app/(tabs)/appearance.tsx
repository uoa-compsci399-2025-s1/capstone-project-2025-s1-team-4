/**
 * Appearance settings: toggles light, dark, system themes. Also
 * controls app-wide font resizing. Upper and lower bounds can
 * be set for fonts by adjusting slider values.
 */
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-assets/slider';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/theme_context';

export default function AppearanceTab() {
  const { theme, setTheme, textSize, setTextSize, themeStyles, themeColors } = useTheme();
  useRouter();

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={styles.pageTitleWrapper}>
        <Text style={[styles.pageTitleText, themeStyles.text]}>Appearance</Text>
      </View>

      <Text style={[styles.heading, themeStyles.text, { fontSize: textSize + 4 }]}>Theme</Text>
      <View style={[styles.settingCard, themeStyles.card]}>
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
                !isLast && { borderBottomWidth: 1, borderBottomColor: '#eee' },
              ]}
            >
              <Text
                style={[
                  styles.settingText,
                  themeStyles.text,
                  { fontSize: textSize },
                  isSelected && { fontWeight: 'bold', color: themeColors.iconColor },
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
              <Ionicons
                name="checkmark-sharp"
                size={18}
                color={isSelected ? themeColors.iconColor : 'transparent'}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.heading, themeStyles.text, { fontSize: textSize + 4 }]}>Font Size</Text>
      <View style={[styles.settingCard, themeStyles.card]}>
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
            thumbTintColor={themeColors.med}
            minimumTrackTintColor={themeColors.light}
            maximumTrackTintColor={themeColors.dark}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    flexGrow: 1,},
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#336699',
    marginBottom: 10,
    marginTop: -7,},
  label: {
    flex: 1,},
  slider: {
    width: '100%',
    height: 40,},
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 23,},
  pageTitleText: {
    fontSize: 40,
    color: '#336699',},
  settingCard: {
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 12,
    marginBottom: 30,
    elevation: 3,},
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    marginHorizontal: -12,
    paddingHorizontal: 12,},
  settingText: {
    fontSize: 17,
    color: '#336699',},
  sliderContent: {
    paddingVertical: 8,
    paddingHorizontal: 4,}});
