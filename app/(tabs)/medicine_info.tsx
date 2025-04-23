import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { useLocalSearchParams } from 'expo-router';

export default function MedicineInfo() {
  const { barcode, id } = useLocalSearchParams();

  const barcodeStr = typeof barcode === 'string' ? barcode : null;
  const medicineId = typeof id === 'string' ? Number(id) : null;

  const [cmiData, setCmiData] = useState<any>(null);

  useEffect(() => {
    // Construct the query parameter correctly
    const queryParam = barcodeStr 
      ? `barcode=${encodeURIComponent(barcodeStr)}`
      : medicineId !== null
      ? `id=${medicineId}`
      : null;
  
    if (!queryParam) return;
  
  
    fetch(`${API_BASE_URL}/medicine/cmi_sheet?${queryParam}`)
      .then(res =>  res.json())
      .then(json => {
        setCmiData(json); // Set the data you want from the response
      })
      .catch(console.error);
    
  }, [barcodeStr, medicineId]);

  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>CMI Sheet</Text>
      {barcodeStr && <Text style={styles.header}>{barcodeStr}</Text>}
      
      {!cmiData ? (
        <Text style={styles.body}>Loading CMI data...</Text>
      ) : (
        Object.entries(cmiData).map(([key, value]) => (
          <View key={key} style={styles.section}>
            <Text style={styles.title}>{key.toUpperCase()}</Text>
            <Text style={styles.body}>{String(value)}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#336699',
  },
  body: {
    fontSize: 14,
    color: '#333',
  },
});
