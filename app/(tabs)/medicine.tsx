import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { API_BASE_URL } from '../../config'; 
import { MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';
import { useBookmarks } from '../../context/bookmarks_context';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../context/theme_context'

export default function DetailsScreen() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { bookmarks, toggleBookmark } = useBookmarks(); 
  const searchRef = useRef<TextInput>(null);
  const { focusSearch } = useLocalSearchParams();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'company'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


  useEffect(() => {
    fetch(`${API_BASE_URL}/all_medicines`)
      .then((res) => {
        console.log("Fetch status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setMedicines(data);
      })
      .catch((err) => console.error('Failed to fetch medicines:', err));
  }, []);

  useFocusEffect(
    useCallback(() => {
      let timeout: NodeJS.Timeout;
  
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
    <View style={styles.container}>
      {/* Pill Icon Header */}
      <View style={styles.pageTitleWrapper}>
            <Text style={styles.pageTitleText}>All Medicines</Text> 
        </View>

  <View>
    <View style={styles.searchWrapper}>
      <TextInput
        ref={searchRef}
        style={styles.searchInput}
        placeholder="Search Medicine"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
        <Ionicons name="chevron-expand-sharp" size={24} color="#336699" />
      </TouchableOpacity>
    </View>

    {showDropdown && (
  <View style={styles.dropdownPanel}>
    {[
      { label: 'Name', key: 'name' },
      { label: 'Manufacturer', key: 'company' },
    ].map(({ label, key }) => (
      <View key={key} style={styles.dropdownItemRow}>
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
              sortBy === key && { fontWeight: 'bold' },
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (sortBy === key) {
              setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
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
            color="#336699"
          />
        </TouchableOpacity>
      </View>
    ))}
  </View>
)}


  </View>

  <FlatList
  data={sortedMedicines}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.medicineCard}
      onPress={() => {router.push(`/medicine_info?barcode=${encodeURIComponent(item.barcode)}` as const)}}
    >
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.medicineName}>{item.product_name}</Text>
          <Text style={styles.medicineCompany}>{item.company}</Text>
          <Text style={styles.medicineDosage}>
            {item.ingredients?.map((ing: { ingredient: string; dosage?: string }) => `${ing.ingredient} ${ing.dosage || 'N/A'}`).join(',\n') || 'N/A'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => toggleBookmark(item.id)}
          style={styles.starButton}
        >
          <MaterialCommunityIcons
            name={bookmarks.includes(item.id) ? 'bookmark' : 'bookmark-outline'}
            size={26}
            color="#336699"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )}
/>

</View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    marginBottom: 6,
    marginHorizontal: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#333',
  },
  dropdownPanel: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingTop: 0,         
    paddingBottom: 0,      
    overflow: 'hidden',    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 6,
    marginBottom: 6,
    marginHorizontal: 4
  },
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#336699',
  },
});