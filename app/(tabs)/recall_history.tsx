import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking } from 'react-native';
import { useTheme } from '../../context/theme_context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../config';

type Recall = {
  brand_name: string;
  date: string;
  id: number;
  recall_action: string;
  recall_url: string;
};

const NotificationsScreen = () => {
  const { themeStyles, textSize, themeColors } = useTheme();
  const router = useRouter();
  const [recalls, setRecalls] = useState<Recall[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/recalls`) 
      .then(res => res.json())
      .then(data => setRecalls(data))
      .catch(err => console.error('Error fetching recalls:', err));
  }, []);

  const renderRecall = ({ item }: { item: Recall }) => (
    <TouchableOpacity
      style={[styles.card, themeStyles.card]}
      onPress={() => Linking.openURL(item.recall_url)}
    >
      <Text style={[styles.brandName, themeStyles.text, { fontSize: textSize + 2 }]}>
        {item.brand_name}
      </Text>
      <Text style={[styles.date, themeStyles.text, { fontSize: textSize }]}>
        Recall Date: {item.date}
      </Text>
      <Text style={[styles.tap, themeStyles.text, { fontSize: textSize - 1 }]}>
        Tap for details
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, themeStyles.container]}>

      {/* Page Title */}
      <View style={styles.pageTitleWrapper}>
        <Text style={[styles.pageTitleText, themeStyles.text]}>
          Recall History
        </Text>
      </View>

      {/* Recall Cards */}
      <FlatList
        data={recalls}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecall}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 16,
    zIndex: 1,
  },
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 23,
  },
  pageTitleText: {
    fontSize: 40,
    color: '#336699',
  },
  listContent: {
    paddingBottom:10,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'visible',
  },
  brandName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 2,  
  },
  date: {
    marginBottom: 2,  
  },
  tap: {
    textDecorationLine: 'underline',
    marginBottom: 0, 
  },
});

export default NotificationsScreen;
