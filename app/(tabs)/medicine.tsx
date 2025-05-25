import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../../config';
import { useBookmarks } from '../../context/bookmarks_context';
import { useTheme } from '../../context/theme_context';
import * as Network from 'expo-network';

export default function DetailsScreen() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { bookmarks, toggleBookmark } = useBookmarks(); 
  const searchRef = useRef<TextInput>(null);
  const { focusSearch } = useLocalSearchParams();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'company'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const {textSize, themeStyles, themeColors } = useTheme();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
    useEffect(() => {
    const checkConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setIsConnected(networkState.isConnected === true && networkState.isInternetReachable === true);
      } catch (error) {
        console.error('Failed to check network status:', error);
        setIsConnected(false);
      }
    };
  
    checkConnection();
  }, []);


  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/all_medicines`)
      .then((res) => {
        console.log("Fetch status:", res.status);
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        console.log("Fetched data:", data);
        setMedicines(data);
      })
      .catch((err) => {
        console.error('Failed to fetch medicines:', err);
        setLoading(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      let timeout: number;
  
      if (focusSearch === 'true') {
        timeout = setTimeout(() => {
          searchRef.current?.focus();
          router.replace('/medicine');
        }, 250);
      }
  
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }, [focusSearch])
  ); 

  const filteredMedicines = medicines.filter((med) =>
    med.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    const fieldA =
      ((sortBy === 'name' ? a.product_name : a.company) ?? '').toString().trim().toLowerCase();
    const fieldB =
      ((sortBy === 'name' ? b.product_name : b.company) ?? '').toString().trim().toLowerCase();
  
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  

 return (
  <View style={[styles.container, themeStyles.container]}>
    {/* Page Header */}
    <View style={styles.pageTitleWrapper}>
      <Text style={[styles.pageTitleText, themeStyles.text]}>All Medicines</Text>
    </View>

    {/* Search Input */}
    <View>
      <View style={[styles.searchWrapper, themeStyles.card]}>
        <TextInput
          ref={searchRef}
          style={[styles.searchInput, themeStyles.transparentText, { fontSize: textSize }]}
          placeholder="Search Medicines"
          placeholderTextColor={themeColors.transparentTextColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
          <Ionicons name="chevron-expand-sharp" size={24} color={themeColors.iconColor} />
        </TouchableOpacity>
      </View>

      {/* Dropdown for sorting */}
      {showDropdown && (
        <View style={[styles.dropdownPanel, themeStyles.card]}>
          {[{ label: 'Name', key: 'name' }, { label: 'Manufacturer', key: 'company' }].map(
            ({ label, key }, index, arr) => {
              const isLast = index === arr.length - 1;
              return (
                <View
                  key={key}
                  style={[
                    styles.dropdownItemRow,
                    !isLast && { borderBottomWidth: 1, borderBottomColor: '#ccc' },
                  ]}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      setSortBy(key as 'name' | 'company');
                      setSortDirection('asc');
                      setShowDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        themeStyles.text,
                        { fontSize: textSize },
                        sortBy === key && { fontWeight: 'bold' },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (sortBy === key) {
                        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                      } else {
                        setSortBy(key as 'name' | 'company');
                        setSortDirection('desc');
                      }
                      setShowDropdown(false);
                    }}
                  >
                    <MaterialCommunityIcons
                      name={
                        sortBy === key && sortDirection === 'desc'
                          ? 'chevron-down'
                          : 'chevron-up'
                      }
                      size={20}
                      color={themeColors.iconColor}
                    />
                  </TouchableOpacity>
                </View>
              );
            }
          )}
        </View>
      )}
    </View>

    {/* Medicine List or Loading */}
    {isConnected ? (<FlatList
      data={sortedMedicines}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={() => (
        <View style={styles.loadingMedicines}>
          <Text
            style={[
              styles.medicineName,
              themeStyles.text,
              loading && { fontStyle: 'italic' } 
            ]}
          >
            {loading ? 'Loading medicines...' : 'No Results Found'}
          </Text>
        </View>
      )}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.medicineCard, themeStyles.card]}
          onPress={() =>
            router.push(`/medicine_info?barcode=${encodeURIComponent(item.barcode)}` as const)
          }
        >
          <View style={styles.cardContent}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.medicineName,
                  themeStyles.text,
                  { fontSize: textSize + 4 },
                ]}
              >
                {item.product_name}
              </Text>
              <Text
                style={[
                  styles.medicineCompany,
                  themeStyles.text,
                  { fontSize: textSize - 1 },
                ]}
              >
                {item.company}
              </Text>
              <Text
                style={[
                  styles.medicineDosage,
                  themeStyles.bodyText,
                  { fontSize: textSize - 4 },
                ]}
              >
                {item.ingredients
                  ?.slice()
                  .sort((a: { ingredient: string }, b: { ingredient: string }) =>
                    a.ingredient.localeCompare(b.ingredient)
                  )
                  .map(
                    (ing: { ingredient: string; dosage?: string }) =>
                      `${ing.ingredient} ${ing.dosage || 'N/A'}`
                  )
                  .join(',\n') || 'N/A'}
              </Text>
            </View>

            <TouchableOpacity onPress={() => toggleBookmark(item.id)} style={styles.starButton}>
              <MaterialCommunityIcons
                name={bookmarks.includes(item.id) ? 'bookmark' : 'bookmark-outline'}
                size={26}
                color={themeColors.iconColor}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    />):(
        <View style={styles.networkBox}>
          <Text style={[styles.scanText, themeStyles.text]}>No internet connection</Text>
        </View>)}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15, 
    paddingTop: 40,
    backgroundColor: '#f0f8ff',
  },
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  pageTitleText: {
    fontSize: 40,
    color: '#336699',
  },
  medicineCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medicineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#336699',
  },
  medicineCompany: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#336699',
    marginTop: 2,
  },
  starButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicineDosage: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    marginBottom: 6,
    marginHorizontal: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
  dropdownPanel: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: 0,         
    paddingBottom: 0,      
    overflow: 'hidden',    
    elevation: 3,
    marginTop: 6,
    marginBottom: 6,
    marginHorizontal: 5
  },
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#336699',
  },
  loadingMedicines: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  networkBox: {
    backgroundColor: '#e6f0ff',
    marginTop: 150,
    padding: 16,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  scanText: {
    marginTop: 0,
    fontSize: 20,
    color: '#336699',
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 0, 
  },
});