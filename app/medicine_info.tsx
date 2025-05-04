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

  const [medicineData, setMedicineData] = useState<any>(null); // Product name, company, active ingredients, dosage
  const [cmiData, setCmiData] = useState<any>(null); 
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Dropdown section expanding + collapsing behaviour 
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
    const queryParam = barcodeStr 
      ? `barcode=${encodeURIComponent(barcodeStr)}`
      : medicineId !== null
      ? `id=${medicineId}`
      : null;
  
    if (!queryParam) return;
  
    // Fetch the medicine data using barcode or id
    fetch(`${API_BASE_URL}/medicine?${queryParam}`)
      .then(res => res.json())
      .then(json => {
        if (json.found && json.medicine.length > 0) {
          const medicine = json.medicine[0]; // Assuming the medicine data is in the first item of the array
          setMedicineData(medicine); // Set the medicine data (product name, company, etc.)
          
          // Fetch the CMI sheet using the medicine ID
          const medicineId = medicine.id;
          fetch(`${API_BASE_URL}/medicine/cmi_sheet?id=${medicineId}`)
            .then(res => res.json())
            .then(cmiJson => {
              setCmiData(cmiJson);  // Set the CMI data
            })
            .catch(error => {
              console.error('Error fetching CMI sheet:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error fetching medicine:', error);
      });
  }, [barcodeStr, medicineId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Back button to home page */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={40} color="#336699" />
      </TouchableOpacity>

      {/* Display the medicine name and company */}
      {medicineData ? (
        <>
          <Text style={styles.header}>{medicineData.product_name}</Text>
          <Text style={styles.subheader}>{medicineData.company}</Text>

          {/* Display the active ingredients and dosage */}
          {medicineData.ingredients && medicineData.ingredients.length > 0 && (
            <View style={styles.activeIngredientsContainer}>
              <Text style={styles.activeIngredients}>
                {medicineData.ingredients?.map((ing: { ingredient: string; dosage?: string }) => `${ing.ingredient} ${ing.dosage || 'N/A'}`).join(',\n') || 'N/A'}
              </Text>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.body}>Loading medicine information...</Text>
      )}
  
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
            <View key={key} style={styles.sectionWrapper}>
              <View style={styles.sectionCard}>
                <TouchableOpacity onPress={() => toggleSection(key)} style={styles.sectionHeader}>
                  <Text style={styles.title}>{sectionTitle}</Text>
                  <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {isExpanded && (
                  key === '12' || key === '1' ? (
                    <TouchableOpacity onPress={() => handleLinkClick(String(value))}>
                      <Text style={[styles.body, styles.link]}>{String(value)}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.body}>{String(value)}</Text>
                  )
                )}
              </View>
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
    backgroundColor: '#f0f8ff', 
    flexGrow: 1, 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,    
    marginBottom: 4,   
    textAlign: 'center',
    color: '#336699',
  },
  subheader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,   
    textAlign: 'center',
    color: '#336699',
  },  
  activeIngredientsContainer: {
    marginBottom: 8,    
    paddingHorizontal: 8,
  },
  activeIngredients: {
    fontSize: 14,
    marginBottom: 8,
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
    top: 35,
    left: 16,
    zIndex: 1,
  },
  
  sectionWrapper: {
    marginBottom: 12,
  },
  
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
});
