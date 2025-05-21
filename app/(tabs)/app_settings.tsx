import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBookmarks } from '../../context/bookmarks_context';
import { Alert } from 'react-native';
import { useTheme } from '../../context/theme_context'

export default function SettingsScreen() {
  const router = useRouter();
  const { setBookmarks } = useBookmarks();
  const { themeStyles, textSize, themeColors } = useTheme();

  return (
    <ScrollView style={[styles.container, themeStyles.container]}>
        <View style={styles.pageTitleWrapper}>
      <Text style={[styles.pageTitleText, themeStyles.text]}>Settings</Text> 
      </View>
      {/* App Settings */}
      <Text style={[styles.sectionHeader, themeStyles.text]}>App Settings</Text>
      <View style={[styles.settingCard, themeStyles.card]}>
        {[
          { label: 'Appearance', route: '/appearance' },
          { label: 'Recall History', route: '/recall_history' },
          { label: 'Permissions', route: '/permissions' },
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
                if (item.route) router.push(item.route as any); 
                else if (item.onPress) item.onPress();
              }}
              activeOpacity={isPressable ? 0.6 : 1}
              style={[
                styles.settingRow,
                isLast && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={[styles.settingText, themeStyles.text]}>{item.label}</Text>
              <Feather name="chevron-right" size={20} color={themeColors.iconColor} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* About Section */}
      <Text style={[styles.sectionHeader, themeStyles.text]}>About</Text>
      <View style={[styles.settingCard, themeStyles.card]}>
        {[
          { label: 'About Us', route: '/about_us' },
          { label: 'Privacy Policy', route: '/privacy_policy' },
          { label: 'App Version', right: <Text style={[styles.settingValue, themeStyles.text]}>v1.0.0</Text> },
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
              <Text style={[styles.settingText, themeStyles.text]}>{item.label}</Text>
              {item.right ?? (
                isPressable && <Feather name="chevron-right" size={20} color={themeColors.iconColor} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 23,
  },
  pageTitleText: {
    fontSize: 40,
    color: '#336699',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#f0f8ff',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#336699',
    marginBottom: 10,
    marginTop: -7,
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 12,
    marginBottom: 30,
    elevation: 3,
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
    fontSize: 17,
    color: '#336699',
  },
  settingValue: {
    fontSize: 17,
    color: '#336699',
    fontWeight: 'bold',
  },
});
