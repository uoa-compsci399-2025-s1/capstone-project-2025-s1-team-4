import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MedicineInfo() {
  const router = useRouter();
  const { barcode, id } = useLocalSearchParams();

  const barcodeStr = typeof barcode === 'string' ? barcode : null;
  const medicineId = typeof id === 'string' ? Number(id) : null;


  const [cmiData, setCmiData] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Expand + collapse behaviour 
  const toggleSection = (key: string) => {
    setExpandedSections(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };
  
  // Not sure why but the CMI section keys are numbers 
  const getSectionTitle = (key: string, name?: string) => {
    const sectionMap: Record<string, string> = {
      1: `Link to CMI`,
      2: `What this medicine is used for`,
      3: `Before you use this medicine`,
      4: `How to use this medicine`,
      5: `While you are using this medicine`,
      6: `In case of overdose`,
      7: `Side effects`,
      8: `After using this medicine`,
      9: `Product description`,
      10: `Supplier details`,
      11: `Date of preparation`,
      12: `Link to data sheet`
    };
    return sectionMap[key] || key.toUpperCase();
  };

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

<     TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#336699" />
      </TouchableOpacity>

      <Text style={styles.header}>CMI Sheet</Text>
      {barcodeStr && <Text style={styles.header}>{barcodeStr}</Text>}
  
      {!cmiData ? (
        <Text style={styles.body}>Loading CMI data...</Text>
      ) : (
        Object.entries(cmiData.cmi_sheet)
        .filter(([key]) => key !== '0')
        .map(([key, value]) => {
          const isExpanded = expandedSections.includes(key);
          const sectionTitle = getSectionTitle(key, cmiData.medicine_name); // helper function

          // Link is clickable and opens 
          const handleLinkClick = (url: string) => {
            Linking.openURL(url);
          };
  
          return (
            <View key={key} style={styles.section}>
              <TouchableOpacity onPress={() => toggleSection(key)} style={styles.sectionHeader}>
                <Text style={styles.title}>{sectionTitle}</Text>
                <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isExpanded && (
                // Check if it's the "Link to data sheet" section and handle it accordingly
                key === '12' || key === '1'? (
                  <TouchableOpacity onPress={() => handleLinkClick(String(value))}>
                    <Text style={[styles.body, styles.link]}>{String(value)}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.body}>{String(value)}</Text>
                )
              )}
            </View>
          );
        })
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

  arrow: {
    fontSize: 16,
    color: '#336699',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',       
  },

  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },

  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 1,
  },
  
});
