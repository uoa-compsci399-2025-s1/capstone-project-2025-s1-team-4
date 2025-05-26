import * as Network from 'expo-network';
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

export default function NotificationsScreen() {
  const { themeStyles, textSize } = useTheme();
  const [recalls, setRecalls] = useState<Recall[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showOfflineCard, setShowOfflineCard] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setIsConnected(networkState.isConnected === true && networkState.isInternetReachable === true);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (!isConnected) {
      timeout = setTimeout(() => {
        setShowOfflineCard(true);
      }, 1000);
    } else {
      setShowOfflineCard(false);
      if (timeout) clearTimeout(timeout);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isConnected]);

useEffect(() => {
  fetch(`${API_BASE_URL}/recalls`)
    .then(res => res.json())
    .then(data => {
      const parseDate = (str: string): Date => {
        const [day, month, year] = str.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day));
      };
      const sorted = data.sort((a: Recall, b: Recall) =>
        parseDate(b.date).getTime() - parseDate(a.date).getTime()
      );
      setRecalls(sorted);
    })
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
      <Text style={[styles.date, themeStyles.text, { fontSize: textSize - 1 }]}>
        Recall Date: {item.date}
      </Text>
      <Text style={[styles.tap, themeStyles.bodyText, { fontSize: textSize - 4 }]}>
        Tap for details
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={styles.pageTitleWrapper}>
        <Text style={[styles.pageTitleText, themeStyles.text]}>
          Medicine Recalls
        </Text>
      </View>
      {!recalls || recalls.length === 0 ? (
        <View style={styles.loadingWrapper}>
          {isConnected ? (
            <Text
              style={[
                styles.brandName,
                themeStyles.text,
                { fontStyle: 'italic' }
              ]}
            >
              Loading recalls...
            </Text>
          ) : (null)}
        </View>
      ) : (
        <View style={[styles.listContent]}>
          {isConnected ? (
            <FlatList
              data={recalls}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderRecall} contentContainerStyle={styles.listContent}
            />
          ) : showOfflineCard ? (
            <View style={[styles.networkBox, themeStyles.card]}>
              <Text style={[styles.scanText, themeStyles.text]}>No internet connection</Text>
            </View>
          ) : null}

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1},
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 79,
    marginBottom: -3},
  pageTitleText: {
    fontSize: 40,
    color: '#336699'},
  listContent: {
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 10},
  card: {
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    elevation: 3,
    overflow: 'visible'},
  brandName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 2,
    alignContent: 'center'},
  date: {
    marginBottom: 2,
    fontStyle: 'italic'},
  tap: {
    textDecorationLine: 'underline',
    marginBottom: 0},
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20},
  networkBox: {
    backgroundColor: '#e6f0ff',
    marginTop: 191,
    padding: 16,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center'},
  scanText: {
    marginTop: 0,
    fontSize: 20,
    color: '#336699',
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 0,
  }});