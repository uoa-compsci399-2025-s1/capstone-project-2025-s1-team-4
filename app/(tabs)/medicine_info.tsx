import { Router } from "expo-router";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { useLocalSearchParams } from 'expo-router';

export default function MedicineInfo() {

    // Use these two blocks when fetching API is ready

    // Recieve barcode from camera.tsx
    const { barcode } = useLocalSearchParams()

    //const [cmiData, setCmiData] = useState<any>(null);
    // useEffect(() => {
    //     fetch(`http://${API_BASE_URL}/medicine/cmi_sheet?id=1`) // replace argument with dynamic
    //     .then(res => res.json())
    //     .then(json => setCmiData(json))
    //     .catch(console.error);
    // }, []);

    //Example data - Comment out when fetching is ready
    const cmiData = {
        what: "This medicine is used to treat symptoms of seasonal allergies.",
        before: "Do not use if allergic to any of the ingredients.",
        how: "Take one tablet daily with or without food.",
        while: "Avoid driving or operating machinery if drowsy.",
        overdose: "In case of overdose, contact emergency services immediately.",
        side_effects: "Possible side effects include drowsiness, headache, dry mouth.",
        after_using: "Store below 25°C. Keep out of reach of children.",
        product_description: "Each tablet contains 10mg of the active ingredient.",
        supplier_details: "Made by ABC Pharmaceuticals, 123 Pharma Lane, Sydney.",
        date_of_prep: "01/01/2025",
        data_sheet: "Approved by the TGA. For more info, visit www.example.com."
      };
  
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>CMI Sheet</Text>
          <Text style={styles.header}>{barcode}</Text>
          {Object.entries(cmiData).map(([key, value]) => (
            <View key={key} style={styles.section}>
              <Text style={styles.title}>{key.toUpperCase()}</Text>
              <Text style={styles.body}>{value}</Text>
            </View>
          ))}
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