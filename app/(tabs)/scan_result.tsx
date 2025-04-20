import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen() {
  const { barcode, name, company, dosage } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicine Details</Text>
      <Text>Barcode: {barcode}</Text>
      <Text>Name: {name}</Text>
      <Text>Company: {company}</Text>
      <Text>Dosage: {dosage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
});