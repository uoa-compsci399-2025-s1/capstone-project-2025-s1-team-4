import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../../config';
import { useTheme } from '../../context/theme_context';

export default function MedicineInfo() {
  const router = useRouter();
  const { barcode, id } = useLocalSearchParams();

  const barcodeStr = typeof barcode === 'string' ? barcode : null;
  const medicineId = typeof id === 'string' ? Number(id) : null;

  const [medicineData, setMedicineData] = useState<any>(null); // Product name, company, active ingredients, dosage
  const [cmiData, setCmiData] = useState<any>(null); 
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { theme, setTheme, textSize, setTextSize, themeStyles, themeColors } = useTheme();

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

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setExpandedSections([]);
      };
    }, [])
  );

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
  <>
    {!medicineData || !cmiData ? (
      <View style={[styles.loadingWrapper, themeStyles.container]}>
        {!medicineData && (
          <Text
            style={[
              styles.subheader,
              themeStyles.text,
              { textAlign: 'center', fontSize: 20 }
            ]}
          >
            Loading Medicine Data...
          </Text>
        )}
        {!cmiData && (
          <Text
            style={[
              styles.subheader,
              themeStyles.text,
              { textAlign: 'center', fontSize: 20 }
            ]}
          >
            Loading CMI Data...
          </Text>
        )}
      </View>
    ) : (
      <ScrollView contentContainerStyle={[styles.container, themeStyles.container]}>
        {/* Display the medicine name and company */}
        <Text style={[styles.header, themeStyles.text]}>{medicineData.product_name}</Text>
        <Text style={[styles.subheader, themeStyles.text, { fontSize: textSize - 1 }]}>
          Manufacturer: {medicineData.company}
        </Text>

        {/* Active ingredients */}
        {medicineData.ingredients && medicineData.ingredients.length > 0 && (
          <View style={styles.activeIngredientsContainer}>
            <Text style={[styles.activeIngredients, themeStyles.text, { fontSize: textSize - 3 }]}>
              Active Ingredients:{' '}
              {medicineData.ingredients
                .map((ing: { ingredient: string; dosage?: string }) =>
                  `${ing.ingredient} ${ing.dosage || 'N/A'}`
                )
                .join(',\n') || 'N/A'}
            </Text>
          </View>
        )}

        {/* CMI Data */}
        {Object.entries(cmiData.cmi_sheet)
          .filter(([key]) => key !== '0')
          .map(([key, value]) => {
            const isExpanded = expandedSections.includes(key);
            const sectionTitle = getSectionTitle(key, cmiData.medicine_name);

            return (
              <View key={key} style={styles.sectionWrapper}>
                <View style={[styles.sectionCard, themeStyles.card]}>
                  <TouchableOpacity onPress={() => toggleSection(key)} style={styles.sectionHeader}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.title, themeStyles.text, { fontSize: textSize }]}
                        numberOfLines={0} // Allow multiline
                      >
                        {sectionTitle}
                      </Text>
                    </View>
                    <View style={styles.chevronContainer}>
                      <MaterialCommunityIcons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color={themeColors.iconColor}
                      />
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    key === '12' || key === '1' ? (
                      <TouchableOpacity onPress={() => Linking.openURL(String(value))}>
                        <Text style={[styles.body, styles.link]}>{String(value)}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text
                        style={[
                          styles.body,
                          themeStyles.bodyText,
                          { fontSize: textSize - 2 }
                        ]}
                      >
                        {String(value)}
                      </Text>
                    )
                  )}
                </View>
              </View>
            );
          })}
      </ScrollView>
    )}
  </>
);
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff', 
    flexGrow: 1, 
  },
  header: {
    fontSize: 40,
    paddingTop: 47,
    marginTop: 12,    
    marginBottom: 4,   
    textAlign: 'center',
    color: '#336699',
  },
  subheader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 0,  
    fontStyle: 'italic', 
    textAlign: 'center',
    color: '#336699',
  },  
  activeIngredientsContainer: {
    marginBottom: 27,    
    paddingHorizontal: 8,
  },
  activeIngredients: {
    fontSize: 12,
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
  alignItems: 'stretch',
  justifyContent: 'space-between',
  gap: 6,
},

chevronContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: 8,
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
    marginBottom: 10,
  },
  
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    elevation: 3,
  },

  loadingWrapper: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}
});
