import { Text, View, StyleSheet, Button, FlatList } from "react-native";
import { Link, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config'; // adjust path accordingly

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
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  // Fetch medicines from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/all_medicines`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched medicines:', data);
        setMedicines(data);
        setDbConnected(true);
      })
      .catch(error => {
        console.error('Error fetching medicines:', error);
        setDbConnected(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="barcode-scan" size={135} color="white" />
      <Button
        title="Scan a barcode"
        onPress={() => router.navigate('/camera')}
        color="#99CCFF"
      />
      <View style={styles.dbContainer}>
      {dbConnected === null && <Text style={{ color: '#fff'}}>Checking database...</Text>}
      {dbConnected === true && <Text style={{ color: 'lightgreen' }}>Database connected</Text>}
      {dbConnected === false && <Text style={{ color: 'salmon' }}>Database not connected</Text>}
      </View>
      

      {/* <FlatList
        data={medicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Medicine }) => (
          <View style={styles.medicineCard}>
            <Text style={styles.medicineText}>Name: {item.name}</Text>
            <Text style={styles.medicineText}>Company: {item.company}</Text>
            {/* <Text style={styles.medicineText}>Dosage: {item.dosage}</Text>  */}
          </View>
        )}
      /> */}
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
  dbContainer: {
    paddingTop: 10
  }
});