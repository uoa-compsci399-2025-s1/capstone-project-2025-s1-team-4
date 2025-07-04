/**
 * Bookmarks tab: handles bookmarked medicines, tagging
 * functionality, bookmark sorting. Also saves bookmarks
 * to async storage to allow persistence across app launches.
 */
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../../config';
import { useBookmarks } from '../../context/bookmarks_context';
import { useTheme } from '../../context/theme_context';

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
  const { textSize, themeStyles, themeColors, resolvedTheme } = useTheme();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showOfflineCard, setShowOfflineCard] = useState(false);

  const checkConnection = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const connected = networkState.isConnected === true && networkState.isInternetReachable === true;
      setIsConnected(connected);
      return connected;
    } catch (error) {
      console.error('Failed to check network status:', error);
      setIsConnected(false);
      return false;
    }
  };

  const fetchBookmarkedMedicines = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/all_medicines`);
      const all = await res.json();
      const filtered = all.filter((m: any) =>
        bookmarks.some((b: any) => b === m.id || b.id === m.id)
      );
      setBookmarkedMedicines(filtered);
      if (bookmarks.length === 0) {
        setTagsById({});
        setGlobalTags([]);
        AsyncStorage.removeItem('tagsById');
        AsyncStorage.removeItem('globalTags');
      }

    } catch (err) { }
  };

  const loadTagsFromStorage = async () => {
    try {
      const storedTags = await AsyncStorage.getItem('tagsById');
      const storedGlobal = await AsyncStorage.getItem('globalTags');

      if (storedTags) setTagsById(JSON.parse(storedTags));
      if (storedGlobal) setGlobalTags(JSON.parse(storedGlobal));
    } catch (err) { }
  };

  useEffect(() => {
    fetchBookmarkedMedicines();
    loadTagsFromStorage();
  }, [bookmarks]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!isConnected) {
      timeout = setTimeout(() => {
        setShowOfflineCard(true);
      }, 1000);
    } else {
      fetchBookmarkedMedicines();
      loadTagsFromStorage();
      setShowOfflineCard(false);
      if (timeout) clearTimeout(timeout);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isConnected]);

  useFocusEffect(
    useCallback(() => {
      checkConnection();
    }, [])
  );

  const tagFilteredBookmarks =
    filteredTags.length === 0
      ? bookmarkedMedicines
      : bookmarkedMedicines.filter((item) =>
        filteredTags.every(tag => (tagsById[item.id] || []).includes(tag))
      );

  const filteredBookmarks = tagFilteredBookmarks.filter(item =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTag = (id: number) => {
    const tag = newTag.trim();
    if (!tag || (tagsById[id] || []).includes(tag)) return;

    const updatedTagsById = {
      ...tagsById,
      [id]: [...(tagsById[id] || []), tag]};
    setTagsById(updatedTagsById);
    AsyncStorage.setItem('tagsById', JSON.stringify(updatedTagsById));

    const updatedGlobalTags = globalTags.includes(tag)
      ? globalTags
      : [...globalTags, tag];
    setGlobalTags(updatedGlobalTags);
    AsyncStorage.setItem('globalTags', JSON.stringify(updatedGlobalTags));

    setNewTag('');
    const remainingGlobalTags = globalTags.filter(
      gTag => !(updatedTagsById[id] || []).includes(gTag)
    );
    if (remainingGlobalTags.length === 0) {
      setExpandedCardId(null);
    }
    setExpandedCardId(null);
  };

  const removeTagGlobally = (tagToRemove: string) => {
    const updated = Object.fromEntries(
      Object.entries(tagsById).map(([id, tags]) => [
        Number(id),
        tags.filter(t => t !== tagToRemove)])
    );
    setTagsById(updated);
    AsyncStorage.setItem('tagsById', JSON.stringify(updated));

    const updatedGlobal = globalTags.filter(t => t !== tagToRemove);
    setGlobalTags(updatedGlobal);
    AsyncStorage.setItem('globalTags', JSON.stringify(updatedGlobal));
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
    <View style={[styles.container, themeStyles.container]}>
      <View>

        <View style={styles.pageTitleWrapper}>
          <Text style={[styles.pageTitleText, themeStyles.text]}>Bookmarks</Text>
        </View>

        <View style={[styles.searchWrapper, themeStyles.card]}>
          <TextInput
            style={[styles.searchInput, themeStyles.bodyText, { fontSize: textSize }]}
            placeholder="Search Bookmarks"
            placeholderTextColor={themeColors.transparentTextColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
            <Ionicons name="chevron-expand-sharp" size={24} color={themeColors.iconColor} />
          </TouchableOpacity>
        </View>

        {filteredTags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginBottom: 6 }}>
            {([...filteredTags].sort()).map((tag, index) => (
              <View key={index} style={[styles.filterTagPill, { backgroundColor: resolvedTheme === 'dark' ? '#2e3b57' : '#d6eaff' }]}>
                <Text style={[styles.tagPillText, themeStyles.text]}>{tag}</Text>
                <TouchableOpacity onPress={() => setFilteredTags(prev => prev.filter(t => t !== tag))}>
                  <MaterialCommunityIcons name="close" size={14} color={themeColors.iconColor} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {showDropdown && (
          <View style={[styles.dropdownPanel, themeStyles.card]}>
            {[
              { label: 'Recently added', key: 'recent' },
              { label: 'Name', key: 'name' },
              { label: 'Manufacturer', key: 'company' },
              { label: 'Tags', key: 'tags' }
            ].map(({ label, key }, index, arr) => {
              const isLast = index === arr.length - 1;
              return (
                <View
                  key={key}
                  style={[
                    styles.dropdownItemRow,
                    !isLast && { borderBottomWidth: 1, borderBottomColor: '#ccc' }
                  ]}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSortBy(key as any);
                      setSortDirection('asc');
                      setShowDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        themeStyles.text,
                        { fontSize: textSize },
                        sortBy === key && { fontWeight: 'bold' }
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
                        setSortBy(key as any);
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
            })}
          </View>
        )}
      </View>

      {sortedBookmarks.length === 0 && (
        <View style={{ marginTop: 2, paddingHorizontal: 20, alignItems: 'center' }}>
          {isConnected ? (
            <Text style={[styles.emptyBookmarksText, themeStyles.text, { fontSize: textSize + 2, textAlign: 'center' }]}>
              Add a bookmark by selecting the bookmark icon on the right of each medicine card.
            </Text>) :
            (null)}
        </View>
      )}
      
      {isConnected ? (
        <FlatList
          data={sortedBookmarks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={[styles.medicineCard, themeStyles.card]}
                onPress={() => router.push(`/medicine_info?barcode=${encodeURIComponent(item.barcode)}`)}
              >
                <View style={styles.cardContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.medicineName, themeStyles.text, { fontSize: textSize + 4 }]}>{item.product_name}</Text>
                    <Text style={[styles.medicineCompany, themeStyles.text, { fontSize: textSize - 1 }]}>{item.company}</Text>
                    <Text style={[styles.medicineDosage, themeStyles.bodyText, { fontSize: textSize - 4 }]}>
                      {item.ingredients?.map((ing: { ingredient: string; dosage?: string }) => `${ing.ingredient} ${ing.dosage || 'N/A'}`).join(',\n') || 'N/A'}
                    </Text>
                    <View style={styles.tagRow}>
                      <View style={styles.tagList}>
                        {[...(tagsById[item.id] || [])].sort().map((tag, index) => (
                          <View key={index} style={[styles.tagPill, { backgroundColor: resolvedTheme === 'dark' ? '#2e3b57' : '#d6eaff' }]}>
                            <TouchableOpacity onPress={() => {
                              if (!filteredTags.includes(tag)) {
                                setFilteredTags(prev => [...prev, tag]);
                              }
                            }}>
                              <Text style={[styles.tagPillText, themeStyles.text]}>{tag}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                              setTagsById(prev => {
                                const updated = {
                                  ...prev,
                                  [item.id]: (prev[item.id] || []).filter(t => t !== tag)};
                                AsyncStorage.setItem('tagsById', JSON.stringify(updated));
                                const tagStillUsed = Object.values(updated).some(tags => tags.includes(tag));
                                if (!tagStillUsed) {
                                  removeTagGlobally(tag);
                                  const updatedGlobal = globalTags.filter(t => t !== tag);
                                  setGlobalTags(updatedGlobal);
                                  AsyncStorage.setItem('globalTags', JSON.stringify(updatedGlobal));
                                  setFilteredTags(prev => prev.filter(t => t !== tag));
                                }
                                return updated;
                              });
                            }}>
                              <MaterialCommunityIcons name="close" size={14} color={themeColors.iconColor} />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                      <TouchableOpacity
                        style={styles.addTagButton}
                        onPress={() => setExpandedCardId(expandedCardId === item.id ? null : item.id)}
                      >
                        <MaterialCommunityIcons name="plus" size={20} color={themeColors.iconColor} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => {
                    toggleBookmark(item.id);
                    setTimeout(() => {
                      const remaining = sortedBookmarks.filter(b => b.id !== item.id);
                      if (remaining.length === 0) setFilteredTags([]);
                    }, 0);
                    const updatedTags = { ...tagsById };
                    const removedTags = updatedTags[item.id] || [];
                    delete updatedTags[item.id];
                    setTagsById(updatedTags);
                    AsyncStorage.setItem('tagsById', JSON.stringify(updatedTags));
                    const remainingTags = Object.values(updatedTags).flat();
                    const cleanedGlobalTags = globalTags.filter(tag => remainingTags.includes(tag));
                    setGlobalTags(cleanedGlobalTags);
                    AsyncStorage.setItem('globalTags', JSON.stringify(cleanedGlobalTags));
                  }} style={styles.starButton}>
                    <MaterialCommunityIcons
                      name={bookmarks.includes(item.id) ? 'bookmark' : 'bookmark-outline'}
                      size={26}
                      color={themeColors.iconColor}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              {expandedCardId === item.id && (
                <View style={[styles.tagDropdownCard, themeStyles.card]}>
                  <TextInput
                    value={newTag}
                    onChangeText={setNewTag}
                    placeholder="Enter a new tag"
                    placeholderTextColor={themeColors.transparentTextColor}
                    style={[styles.tagInput, themeStyles.card, { color: themeColors.dark }, { fontSize: textSize - 2 }]}
                    onSubmitEditing={() => handleAddTag(item.id)}
                    returnKeyType="done"
                  />
                  <View style={styles.dropdownTagList}>
                    {[...globalTags]
                      .filter(tag => !(tagsById[item.id] || []).includes(tag))
                      .sort()
                      .map((tag, index) => (
                        <View key={index} style={[styles.dropdownTagPill, { backgroundColor: resolvedTheme === 'dark' ? '#2e3b57' : '#d6eaff' }]}>
                          <TouchableOpacity onPress={() => {
                            setTagsById(prev => ({
                              ...prev,
                              [item.id]: [...(prev[item.id] || []), tag]}));
                            setExpandedCardId(null);
                          }}>
                            <Text style={[styles.tagPillText, themeStyles.text]}>{tag}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                            removeTagGlobally(tag);
                            const remaining = globalTags.filter(t => t !== tag);
                            if (remaining.length === 0) {
                              setExpandedCardId(null);
                            }
                          }}>
                            <MaterialCommunityIcons
                              name="close"
                              size={14}
                              color={themeColors.iconColor}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                  </View>
                </View>
              )}
            </View>
          )}
        />
      ) : showOfflineCard ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[styles.scanText, themeStyles.text]}>No internet connection</Text>
          <TouchableOpacity
            onPress={checkConnection}
            style={[{
              marginTop: 20,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
            }, themeStyles.card]}
          >
            <Text style={[{ fontSize: textSize }, themeStyles.text]}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 40,
    backgroundColor: '#f0f8ff'},
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    marginBottom: 6,
    marginHorizontal: 4},
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#333'},
  medicineCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 5,
    elevation: 3},
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'},
  medicineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#336699'},
  medicineCompany: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#336699',
    marginTop: 2},
  medicineDosage: {
    fontSize: 12,
    color: '#555',
    marginTop: 2},
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center'},
  tagInput: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#333',
    width: '100%',
    alignSelf: 'center'
  },
  starButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center'},
  tagDropdownCard: {
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 5,
    elevation: 3
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6},
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5},
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6},
  tagPillText: {
    fontSize: 12,
    color: '#336699',
    marginRight: 6},
  dropdownTagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 7},
  dropdownTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 9},
  dropdownPanel: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: 0,
    paddingBottom: 0,
    overflow: 'hidden',
    elevation: 3,
    marginTop: 6,
    marginBottom: 6,
    marginHorizontal: 5},
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#eee'},
  dropdownItemText: {
    fontSize: 16,
    color: '#336699'},
  filterTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
    marginLeft: 5},
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20},
  pageTitleText: {
    fontSize: 40,
    color: '#336699'},
  emptyBookmarksText: {
    fontSize: 20,
    color: '#336699',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 0},
  networkBox: {
    backgroundColor: '#e6f0ff',
    marginTop: 148,
    padding: 16,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center'},
  scanText: {
    fontSize: 20,
    color: '#336699',
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 0}});
