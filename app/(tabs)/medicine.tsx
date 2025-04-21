import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config'; // adjust if needed


export default function DetailsScreen() {
  const { barcode, name, company, dosage } = useLocalSearchParams();
  const [medicines, setMedicines] = useState<any[]>([]);

useEffect(() => {
  fetch(`${API_BASE_URL}/all_medicines`)
    .then((res) => res.json())
    .then((data) => setMedicines(data))
    .catch((err) => console.error('Failed to fetch medicines:', err));
}, []);


  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginTop: 30 }]}>All Medicines</Text>

<FlatList
  data={medicines}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.medicineCard}>
      <Text style={styles.infoText}>Name: {item.name}</Text>
      <Text style={styles.infoText}>Company: {item.company}</Text>
      <Text style={styles.infoText}>Dosage: {item.dosage}</Text>
    </View>
  )}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#336699',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  medicineCard: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  
});