import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/theme_context';

export default function PageNameScreen() {
  const { themeStyles, textSize } = useTheme();
  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.text, { fontSize: textSize + 8 }]}>
        About Us
      </Text>
      <Text style={[styles.subtitle, themeStyles.text, { fontSize: textSize }]}>
        We are the 6 Degrees of Computation and we hope to solve your everyday medicinal concerns.
      </Text>
    </View>
  );
}

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