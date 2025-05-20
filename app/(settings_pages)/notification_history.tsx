import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking } from 'react-native';
import { useTheme } from '../../context/theme_context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Recall = {
  brand_name: string;
  date: string;
  id: number;
  recall_action: string;
  recall_url: string;
};

const NotificationsScreen = () => {
  const { themeStyles, textSize } = useTheme();
  const router = useRouter();
  const [recalls, setRecalls] = useState<Recall[]>([]);

  useEffect(() => {
    fetch('http://192.168.1.69:5000/recalls') // Replace with your backend IP on a device
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
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={40} color="#336699" />
      </TouchableOpacity>

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
    padding: 20,
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
    marginTop: 60,
    marginBottom: 23,
  },
  pageTitleText: {
    fontSize: 40,
    color: '#336699',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  brandName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    marginBottom: 4,
  },
  tap: {
    textDecorationLine: 'underline',
  },
});

export default NotificationsScreen;
