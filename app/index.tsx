import { Text, View, StyleSheet, Button, FlatList } from "react-native";
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';

// Define the medicine type
type Medicine = {
  id: number;
  name: string;
  company: string;
  dosage: string;
};

export default function Index() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // Fetch medicines from backend
  useEffect(() => {
    fetch('http://192.168.68.104:5000/all_medicines')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched medicines:', data);
        setMedicines(data);
      })
      .catch(error => {
        console.error('Error fetching medicines:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="camera" size={32} color="white" />
      <Button
        title="Load Camera"
        onPress={() => router.navigate('/camera')}
        color="#99CCFF"
      />

      <Text style={styles.heading}>Available Medicines:</Text>

      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Medicine }) => (
          <View style={styles.medicineCard}>
            <Text style={styles.medicineText}>Name: {item.name}</Text>
            <Text style={styles.medicineText}>Company: {item.company}</Text>
            <Text style={styles.medicineText}>Dosage: {item.dosage}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#336699',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  medicineCard: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: '100%',
  },
  medicineText: {
    fontSize: 16,
    color: '#333',
  },
});