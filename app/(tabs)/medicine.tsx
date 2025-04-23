import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBookmarks } from '../../context/bookmarks_context';
import { useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function DetailsScreen() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const {bookmarks, toggleBookmark } = useBookmarks(); 
  const searchRef = useRef<TextInput>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/all_medicines`)
      .then((res) => res.json())
      .then((data) => setMedicines(data))
      .catch((err) => console.error('Failed to fetch medicines:', err));
  }, []);

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100); // slight delay to ensure screen has rendered
    }, [])
  );
  

  const filteredMedicines = medicines.filter((item) =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
      <TextInput
        ref={searchRef}
        style={styles.searchInput}
        placeholder="Search Medicine"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity onPress={() => console.log('Filter tapped')}>
        <MaterialCommunityIcons name="filter" size={24} color="#336699" />
      </TouchableOpacity>
    </View>
    
      <FlatList
        data={filteredMedicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.medicineCard}>
            <View style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.medicineName}>{item.name}</Text>
                <Text style={styles.medicineCompany}>{item.company}</Text>
                <Text style={styles.medicineDosage}>{item.dosage}</Text>
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
          </View>
        )}
      />
    </View>
  );
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
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#333',
  },
});
