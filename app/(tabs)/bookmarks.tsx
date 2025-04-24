import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useBookmarks } from '../../context/bookmarks_context';
import { API_BASE_URL } from '../../config';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

export default function BookmarksScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedMedicines, setBookmarkedMedicines] = useState<any[]>([]);
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [newTag, setNewTag] = useState('');
  const [tagsById, setTagsById] = useState<{ [id: number]: string[] }>({});
  const [globalTags, setGlobalTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'company' | 'tags'>('recent');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

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

  const tagFilteredBookmarks =
    filteredTags.length === 0
      ? bookmarkedMedicines
      : bookmarkedMedicines.filter((item) =>
          (tagsById[item.id] || []).some(tag => filteredTags.includes(tag))
        );

  const filteredBookmarks = tagFilteredBookmarks.filter(item =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTag = (id: number) => {
    const tag = newTag.trim();
    if (!tag || (tagsById[id] || []).includes(tag)) return;

    setTagsById(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), tag],
    }));

    setGlobalTags(prev => (prev.includes(tag) ? prev : [...prev, tag]));
    setNewTag('');
    const remainingGlobalTags = globalTags.filter(gTag => !(tagsById[id] || []).includes(gTag));
    if (remainingGlobalTags.length === 0) {
    setExpandedCardId(null);
}
    setExpandedCardId(null);
  };

  const removeTagGlobally = (tagToRemove: string) => {
    setTagsById(prev => {
      const updated = Object.fromEntries(
        Object.entries(prev).map(([id, tags]) => [
          Number(id),
          tags.filter(t => t !== tagToRemove),
        ])
      );
      return updated;
    });
    setGlobalTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc'
        ? a.product_name.localeCompare(b.product_name)
        : b.product_name.localeCompare(a.product_name);
    }
    if (sortBy === 'company') {
      return sortDirection === 'asc'
        ? a.company.localeCompare(b.company)
        : b.company.localeCompare(a.company);
    }
    if (sortBy === 'tags') {
      const aTags = tagsById[a.id] || [];
      const bTags = tagsById[b.id] || [];
    
      const aHasTags = aTags.length > 0;
      const bHasTags = bTags.length > 0;
    
      if (aHasTags && !bHasTags) return -1;
      if (!aHasTags && bHasTags) return 1;
    
      if (!aHasTags && !bHasTags) {
        return a.product_name.localeCompare(b.product_name);
      }
    
      const aFirstTag = [...aTags].sort()[0];
      const bFirstTag = [...bTags].sort()[0];
      const tagComparison = aFirstTag.localeCompare(bFirstTag);
    
      if (tagComparison !== 0) return sortDirection === 'asc' ? tagComparison : -tagComparison;
    
      return sortDirection === 'asc'
        ? a.product_name.localeCompare(b.product_name)
        : b.product_name.localeCompare(a.product_name);
    }    
    if (sortBy === 'recent') {
      const aIndex = bookmarks.indexOf(a.id);
      const bIndex = bookmarks.indexOf(b.id);
      return sortDirection === 'asc' ? aIndex - bIndex : bIndex - aIndex;
    }
    return 0;
  });

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Bookmarks"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
            <FontAwesome name="sort" size={24} color="#336699" />
          </TouchableOpacity>
        </View>

        {filteredTags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginBottom: 6 }}>
            {filteredTags.map((tag, index) => (
              <View key={index} style={styles.filterTagPill}>
                <Text style={styles.filterTagText}>{tag}</Text>
                <TouchableOpacity onPress={() => setFilteredTags(prev => prev.filter(t => t !== tag))}>
                  <MaterialCommunityIcons name="close" size={14} color="#336699" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {showDropdown && (
          <View style={styles.dropdownPanel}>
            {[{ label: 'Recently added', key: 'recent' }, { label: 'Name', key: 'name' }, { label: 'Manufacturer', key: 'company' }, { label: 'Tags', key: 'tags' }].map(({ label, key }) => (
              <View key={key} style={styles.dropdownItemRow}>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.7} onPress={() => { setSortBy(key as any); setSortDirection('asc'); setShowDropdown(false); }}>
                  <Text style={[styles.dropdownItemText, sortBy === key && { fontWeight: 'bold' }]}>{label}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { if (sortBy === key) { setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc')); } else { setSortBy(key as any); setSortDirection('desc'); } setShowDropdown(false); }}>
                  <MaterialCommunityIcons name={sortBy === key && sortDirection === 'desc' ? 'chevron-down' : 'chevron-up'} size={20} color="#336699" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <FlatList
        data={sortedBookmarks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity style={styles.medicineCard}>
              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.medicineName}>{item.product_name}</Text>
                  <Text style={styles.medicineCompany}>{item.company}</Text>
                  <Text style={styles.medicineDosage}>
                    {item.ingredients?.[0] ? `${item.ingredients[0].dosage} ${item.ingredients[0].unit || ''}` : 'N/A'}
                  </Text>
                  <View style={styles.tagRow}>
                    <View style={styles.tagList}>
                      {[...(tagsById[item.id] || [])].sort().map((tag, index) => (
                        <View key={index} style={styles.tagPill}>
                          <TouchableOpacity onPress={() => {
                            if (!filteredTags.includes(tag)) {
                              setFilteredTags(prev => [...prev, tag]);
                            }
                          }}>
                            <Text style={styles.tagPillText}>{tag}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                          onPress={() => {
                            setTagsById(prev => {
                              const updated = {
                                ...prev,
                                [item.id]: (prev[item.id] || []).filter(t => t !== tag),
                              };
                          
                              // Check if the tag still exists in any medicine after removal
                              const tagStillUsed = Object.values(updated).some(tags =>
                                tags.includes(tag)
                              );
                          
                              if (!tagStillUsed) {
                                setGlobalTags(prev => prev.filter(t => t !== tag));
                              }
                          
                              return updated;
                            });
                          }}
                        >
                          <MaterialCommunityIcons name="close" size={14} color="#336699" />
                        </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                    <TouchableOpacity style={styles.addTagButton} onPress={() => setExpandedCardId(expandedCardId === item.id ? null : item.id)}>
                      <MaterialCommunityIcons name="plus" size={20} color="#336699" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => toggleBookmark(item.id)} style={styles.starButton}>
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

                <View style={styles.dropdownTagList}>
                  {[...globalTags].filter(tag => !(tagsById[item.id] || []).includes(tag)).sort().map((tag, index) => (
                    <View key={index} style={styles.dropdownTagPill}>
                      <TouchableOpacity
                        onPress={() => {
                          setTagsById(prev => ({
                            ...prev,
                            [item.id]: [...(prev[item.id] || []), tag],
                          }));

                          const remainingAfterAdd = globalTags.filter(
                            t => !(tagsById[item.id] || []).includes(t) && t !== tag
                          );

                          setExpandedCardId(null); 
                        }}
                      >
                        <Text style={styles.dropdownTagText}>{tag}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          removeTagGlobally(tag);

                          // After removing the tag, check if there are any tags left
                          const remaining = globalTags.filter(t => t !== tag);
                          if (remaining.length === 0) {
                            setExpandedCardId(null);
                          }
                        }}
                      >
                        <MaterialCommunityIcons name="close" size={14} color="#336699" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
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
  dropdownPanel: {
    backgroundColor: '#fff',
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
  filterTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d6eaff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 4,
  },
  filterTagText: {
    fontSize: 12,
    color: '#336699',
    marginRight: 6,
  },
});