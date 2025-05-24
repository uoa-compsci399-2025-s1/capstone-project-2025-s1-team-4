import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../../config';
import { useTheme } from '../../context/theme_context';

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
      <Text style={[styles.brandName, themeStyles.text, { fontSize: textSize + 4 }]}>
        {item.brand_name}
      </Text>
      <Text style={[styles.date, themeStyles.text, { fontSize: textSize - 1}]}>
        Recall Date: {item.date}
      </Text>
      <Text style={[styles.tap, themeStyles.bodyText, { fontSize: textSize - 4 }]}>
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

    {!recalls || recalls.length === 0 ? (
      <View style={styles.loadingWrapper}>
        <Text
          style={[
            styles.brandName,
            themeStyles.text,
            { fontStyle: 'italic' }
          ]}
        >
          Loading recalls...
        </Text>
      </View>
    ) : (
      <FlatList
        data={recalls}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecall}
        contentContainerStyle={styles.listContent}
      />
    )}
  </View>
);
}

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
    marginBottom: 20,
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
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    elevation: 3,
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
    alignContent: 'center' 
  },
  date: {
    marginBottom: 2,
    fontStyle: 'italic',  
  },
  tap: {
    textDecorationLine: 'underline',
    marginBottom: 0, 
  },
loadingRecalls: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
loadingWrapper: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
});

export default NotificationsScreen;
