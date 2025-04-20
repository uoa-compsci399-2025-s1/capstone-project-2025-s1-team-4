import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen() {
  const { barcode, name, company, dosage } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicine Details</Text>
      <Text style={styles.infoText}>Barcode: {barcode}</Text>
      <Text style={styles.infoText}>Name: {name}</Text>
      <Text style={styles.infoText}>Company: {company}</Text>
      <Text style={styles.infoText}>Dosage: {dosage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#336699'
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#99CCFF'
  },
  infoText: {
    fontSize: 16,
    color: 'white'
  }
});