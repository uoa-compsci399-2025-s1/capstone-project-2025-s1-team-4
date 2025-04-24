import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBookmarks } from '../../context/bookmarks_context';
import { Alert } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { setBookmarks } = useBookmarks();

  return (
    <ScrollView style={styles.container}>
      {/* App Settings */}
      <Text style={styles.sectionHeader}>App Settings</Text>
      <View style={styles.settingCard}>
        {[
          { label: 'Appearance', route: '/settings_pages/appearance' },
          { label: 'Notification History', route: '/settings_pages/notification_history' },
          { label: 'Permissions', route: '/settings_pages/permissions' },
          {
            label: 'Clear Bookmarks',
            onPress: () =>
              Alert.alert(
                'Clear Bookmarks',
                'Are you sure you want to remove all bookmarks?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                      await AsyncStorage.removeItem('bookmarks');
                      setBookmarks([]);
                    },
                  },
                ]
              ),
          }
        ].map((item, index, arr) => {
          const isLast = index === arr.length - 1;
          const isPressable = item.route || item.onPress;

          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                if (item.route) router.push(item.route as any); // ✅ fix route TS error
                else if (item.onPress) item.onPress();
              }}
              activeOpacity={isPressable ? 0.6 : 1}
              style={[
                styles.settingRow,
                isLast && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={styles.settingText}>{item.label}</Text>
              <Feather name="chevron-right" size={20} color="#336699" />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* About Section */}
      <Text style={styles.sectionHeader}>About</Text>
      <View style={styles.settingCard}>
        {[
          { label: 'About Us', route: '/settings_pages/about_us' },
          { label: 'Privacy Policy', route: '/settings_pages/privacy_policy' },
          { label: 'App Version', right: <Text style={styles.settingValue}>v1.0.0</Text> },
        ].map((item, index, arr) => {
          const isLast = index === arr.length - 1;
          const isPressable = !!item.route;

          return (
            <TouchableOpacity
              key={item.label}
              onPress={item.route ? () => router.push(item.route as any) : undefined}
              activeOpacity={isPressable ? 0.6 : 1}
              disabled={!isPressable}
              style={[
                styles.settingRow,
                isLast && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={styles.settingText}>{item.label}</Text>
              {item.right ?? (
                isPressable && <Feather name="chevron-right" size={20} color="#336699" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#336699',
    marginBottom: 12,
    marginTop: 24,
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginHorizontal: -12,
    paddingHorizontal: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#336699',
  },
  settingValue: {
    fontSize: 16,
    color: '#336699',
    fontWeight: 'bold',
  },
});
