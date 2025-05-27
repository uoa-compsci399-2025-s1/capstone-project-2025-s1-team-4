import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from '../../context/bookmarks_context';
import { useTheme } from '../../context/theme_context';

export default function SettingsScreen() {
  const router = useRouter();
  const { setBookmarks } = useBookmarks();
  const { themeStyles, textSize, themeColors, theme } = useTheme();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleClearBookmarks = async () => {
    await AsyncStorage.removeItem('bookmarks');
    setBookmarks([]);
    setConfirmVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.container, themeStyles.container]}>
        <View style={styles.pageTitleWrapper}>
          <Text style={[styles.pageTitleText, themeStyles.text]}>Settings</Text>
        </View>

        <Text style={[styles.sectionHeader, themeStyles.text, { fontSize: textSize + 4 }]}>App Settings</Text>
        <View style={[styles.settingCard, themeStyles.card]}>
          {[
            { label: 'Appearance', route: '/appearance' },
            { label: 'Permissions', route: '/permissions' },
            { label: 'Medicine Recalls', route: '/recall_history' },
            { label: 'Clear Bookmarks', onPress: () => setConfirmVisible(true) },
          ].map((item, index, arr) => {
            const isLast = index === arr.length - 1;
            const isPressable = item.route || item.onPress;

            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  if (item.route) router.push(item.route as any);
                  else if (item.onPress) item.onPress();
                }}
                activeOpacity={isPressable ? 0.6 : 1}
                style={[styles.settingRow, isLast && { borderBottomWidth: 0 }]}
              >
                <Text style={[styles.settingText, themeStyles.text, { fontSize: textSize }]}>{item.label}</Text>
                <Feather name="chevron-right" size={20} color={themeColors.iconColor} />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.sectionHeader, themeStyles.text, { fontSize: textSize + 4 }]}>About</Text>
        <View style={[styles.settingCard, themeStyles.card]}>
          {[
            { label: 'About Us', route: '/about_us' },
            { label: 'Privacy & Legal Information', route: '/privacy_policy' },
            {
              label: 'App Version',
              right: <Text style={[styles.settingValue, themeStyles.text, { fontSize: textSize }]}>v1.0.0</Text>,
            },
          ].map((item, index, arr) => {
            const isLast = index === arr.length - 1;
            const isPressable = !!item.route;

            return (
              <TouchableOpacity
                key={item.label}
                onPress={item.route ? () => router.push(item.route as any) : undefined}
                activeOpacity={isPressable ? 0.6 : 1}
                disabled={!isPressable}
                style={[styles.settingRow, isLast && { borderBottomWidth: 0 }]}
              >
                <Text style={[styles.settingText, themeStyles.text, { fontSize: textSize }]}>{item.label}</Text>
                {item.right ?? (
                  isPressable && <Feather name="chevron-right" size={20} color={themeColors.iconColor} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Modal transparent visible={confirmVisible}>
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            themeStyles.container
          ]}>
            <Text style={[
              styles.modalTitle,
              { color: theme === 'dark' ? '#fff' : '#000' }
            ]}>
              Clear Bookmarks
            </Text>
            <Text style={[
              styles.modalText,
              { color: theme === 'dark' ? '#ccc' : '#333' }
            ]}>
              Are you sure you want to remove all bookmarks? This cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setConfirmVisible(false)} style={{ marginRight: 20 }}>
                <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClearBookmarks}>
                <Text style={{ color: 'red' }}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 23,},
  pageTitleText: {
    fontSize: 40,
    color: '#336699',},
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#f0f8ff',},
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#336699',
    marginBottom: 10,
    marginTop: -7,},
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 12,
    marginBottom: 30,
    elevation: 3,},
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginHorizontal: -12,
    paddingHorizontal: 12,},
  settingText: {
    fontSize: 17,
    color: '#336699',},
  settingValue: {
    fontSize: 17,
    color: '#336699',
    fontWeight: 'bold',},
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,},
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,},
  modalTitle: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',},
  modalText: {
    marginBottom: 20,},
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'}});