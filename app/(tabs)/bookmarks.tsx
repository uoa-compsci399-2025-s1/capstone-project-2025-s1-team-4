import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useBookmarks } from '../../context/bookmarks_context';
import { API_BASE_URL } from '../../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BookmarksScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedMedicines, setBookmarkedMedicines] = useState<any[]>([]);
  const { bookmarks, toggleBookmark } = useBookmarks();

  useEffect(() => {
    const fetchBookmarkedMedicines = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/all_medicines`);
        const all = await res.json();
        const filtered = all.filter((m: any) =>
          bookmarks.some((b: any) => b === m.id || b.id === m.id)
        );
        setBookmarkedMedicines(filtered);
      } catch (err) {
        console.error('Failed to load medicines:', err);
      }
    };

    fetchBookmarkedMedicines();
  }, [bookmarks]);

  const filteredBookmarks = bookmarkedMedicines.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Bookmarks"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => console.log('Filter tapped')}>
          <MaterialCommunityIcons name="filter" size={24} color="#336699" />
        </TouchableOpacity>
      </View>



      {filteredBookmarks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text
            style={styles.noBookmarks}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            No bookmarked medicines
          </Text>
          <Text style={styles.hintText}>
            You can add bookmarks by tapping on the bookmark icon.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookmarks}
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
                  <MaterialCommunityIcons name="bookmark" size={26} color="#336699" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#333',
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
  medicineDosage: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  starButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noBookmarks: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#336699',
    textAlign: 'center',
  },
  hintText: {
    fontSize: 14,
    fontStyle: 'italic',
    fontFamily: 'sans-serif',
    color: '#888',
    textAlign: 'center',
    marginTop: 6,
  },
});
