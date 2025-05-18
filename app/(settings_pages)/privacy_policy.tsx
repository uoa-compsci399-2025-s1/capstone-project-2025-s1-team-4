import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/theme_context'

export default function PageNameScreen() {
  const { themeStyles, textSize } = useTheme();
  return (
    <View style={themeStyles.container}>
      <Text style={[themeStyles.text, { fontSize: textSize }]}>ava do ur stuff here pls thx.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#336699',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});