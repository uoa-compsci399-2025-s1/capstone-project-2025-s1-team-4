import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { API_BASE_URL } from '../../config'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBookmarks } from '../../context/bookmarks_context';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';

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
        <MaterialCommunityIcons name="filter" size={24} color="#336699" />
      </TouchableOpacity>
    </View>

    {showDropdown && (
  <View style={styles.dropdownPanel}>
    <TouchableOpacity
      onPress={() => {
        setSortBy('name');
        setSortDirection('asc');
        setShowDropdown(false);
      }}
    >
      <View style={styles.dropdownItemRow}>
        <Text
          style={[
            styles.dropdownItemText,
            sortBy === 'name' && sortDirection === 'asc' && { fontWeight: 'bold' },
          ]}
        >
          Name, ascending (A–Z)
        </Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => {
        setSortBy('name');
        setSortDirection('desc');
        setShowDropdown(false);
      }}
    >
      <View style={styles.dropdownItemRow}>
        <Text
          style={[
            styles.dropdownItemText,
            sortBy === 'name' && sortDirection === 'desc' && { fontWeight: 'bold' },
          ]}
        >
          Name, descending (Z–A)
        </Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => {
        setSortBy('company');
        setSortDirection('asc');
        setShowDropdown(false);
      }}
    >
      <View style={styles.dropdownItemRow}>
        <Text
          style={[
            styles.dropdownItemText,
            sortBy === 'company' && sortDirection === 'asc' && { fontWeight: 'bold' },
          ]}
        >
          Manufacturer, ascending (A–Z)
        </Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => {
        setSortBy('company');
        setSortDirection('desc');
        setShowDropdown(false);
      }}
    >
      <View style={styles.dropdownItemRow}>
        <Text
          style={[
            styles.dropdownItemText,
            sortBy === 'company' && sortDirection === 'desc' && { fontWeight: 'bold' },
          ]}
        >
          Manufacturer, descending (Z–A)
        </Text>
      </View>
    </TouchableOpacity>
  </View>
)}


  </View>

  <FlatList
  data={sortedMedicines}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.medicineCard}
      onPress={() => console.log('Tapped:', item.product_name)} // Replace with navigation later
    >
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.medicineName}>{item.product_name}</Text>
          <Text style={styles.medicineCompany}>{item.company}</Text>
          <Text style={styles.medicineDosage}>
            {item.ingredients?.[0]?.dosage || 'N/A'}
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
  medicineCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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