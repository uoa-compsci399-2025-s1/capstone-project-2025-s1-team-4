import { View, Text, StyleSheet } from 'react-native';

export default function PageNameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>We are the 6 degrees of computation and we hope to solve your everyday medicinal concerns.</Text>
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