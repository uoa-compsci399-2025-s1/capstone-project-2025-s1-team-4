import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity} from 'react-native';
import { useState, useEffect } from 'react';
import { useBookmarks } from '../../context/bookmarks_context';
import { API_BASE_URL } from '../../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BookmarksScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedMedicines, setBookmarkedMedicines] = useState<any[]>([]);
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [newTag, setNewTag] = useState('');
  const [tagsById, setTagsById] = useState<{ [id: number]: string[] }>({});
  const [globalTags, setGlobalTags] = useState<string[]>([]);

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
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTag = (id: number) => {
    const tag = newTag.trim();
    if (!tag) return;
  
    setTagsById(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), tag],
    }));
  
    setGlobalTags(prev =>
      prev.includes(tag) ? prev : [...prev, tag]
    );
  
    setNewTag('');
    setExpandedCardId(null);
  };
  
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
          <Text style={styles.noBookmarks} numberOfLines={1} adjustsFontSizeToFit>
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
            <View>
              <TouchableOpacity
                style={styles.medicineCard}
                onPress={() => console.log('Tapped bookmark:', item.product_name)}
              >
                <View style={styles.cardContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medicineName}>{item.product_name}</Text>
                    <Text style={styles.medicineCompany}>{item.company}</Text>
                    <Text style={styles.medicineDosage}>
                      {item.ingredients?.[0]?.dosage || 'N/A'}
                    </Text>
  
                    <View style={styles.tagRow}>
                      <View style={styles.tagList}>
                        {[...(tagsById[item.id] || [])].sort().map((tag, index) => (
                          <View key={index} style={styles.tagPill}>
                            <Text style={styles.tagPillText}>{tag}</Text>
                            <TouchableOpacity
                              onPress={() => {
                                const removedTag = tagsById[item.id][index];
  
                                setTagsById(prev => {
                                  const updatedTags = {
                                    ...prev,
                                    [item.id]: prev[item.id].filter((_, i) => i !== index),
                                  };
  
                                  const tagUsedElsewhere = Object.values(updatedTags).some(tagList =>
                                    tagList.includes(removedTag)
                                  );
  
                                  if (!tagUsedElsewhere) {
                                    setGlobalTags(prevGlobal =>
                                      prevGlobal.filter(tag => tag !== removedTag)
                                    );
                                  }
  
                                  return updatedTags;
                                });
                              }}
                            >
                              <MaterialCommunityIcons name="close" size={14} color="#336699" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
  
                      <TouchableOpacity
                        style={styles.addTagButton}
                        onPress={() =>
                          setExpandedCardId(expandedCardId === item.id ? null : item.id)
                        }
                      >
                        <MaterialCommunityIcons name="plus" size={20} color="#336699" />
                      </TouchableOpacity>
                    </View>
                  </View>
  
                  <TouchableOpacity
                    onPress={() => toggleBookmark(item.id)}
                    style={styles.starButton}
                  >
                    <MaterialCommunityIcons name="bookmark" size={26} color="#336699" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
  
              {expandedCardId === item.id && (
                <View style={styles.tagDropdownCard}>
                  <TextInput
                    value={newTag}
                    onChangeText={setNewTag}
                    placeholder="Enter a new tag"
                    placeholderTextColor="#999"
                    style={styles.tagInput}
                    onSubmitEditing={() => handleAddTag(item.id)}
                    returnKeyType="done"
                  />
  
                  {globalTags
                    .filter(tag => !(tagsById[item.id] || []).includes(tag))
                    .length > 0 && (
                    <View style={styles.dropdownTagList}>
                      {[...globalTags]
                        .filter(tag => !(tagsById[item.id] || []).includes(tag))
                        .sort()
                        .map((tag, index) => (
                          <View key={index} style={styles.dropdownTagPill}>
                            <TouchableOpacity
                              onPress={() => {
                                setTagsById(prev => ({
                                  ...prev,
                                  [item.id]: [...(prev[item.id] || []), tag],
                                }));
                              }}
                            >
                              <Text style={styles.dropdownTagText}>{tag}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => {
                                setTagsById(prev => {
                                  const updated = Object.fromEntries(
                                    Object.entries(prev).map(([id, tags]) => [
                                      Number(id),
                                      tags.filter(t => t !== tag),
                                    ])
                                  );
                                  return updated;
                                });

                                setGlobalTags(prev => prev.filter(t => t !== tag));
                              }}
                            >
                              <MaterialCommunityIcons name="close" size={14} color="#336699" />
                            </TouchableOpacity>
                          </View>
                        ))}
                    </View>
                  )}
                </View>
              )}
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
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addTagText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#336699',
    fontStyle: 'italic',
  },
  tagDropdown: {
    marginTop: 8,
    backgroundColor: '#f5faff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cce0ff',
  },
  tagInput: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#333',
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
  tagDropdownCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0efff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 4,
  },
  tagPillText: {
    fontSize: 12,
    color: '#336699',
    marginRight: 6,
  },
  dropdownTagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  dropdownTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e9f2ff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 6,
  },
  dropdownTagText: {
    fontSize: 12,
    color: '#336699',
    fontWeight: '500',
  },
});