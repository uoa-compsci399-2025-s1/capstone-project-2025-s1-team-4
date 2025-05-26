import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { BookmarkProvider } from '../../context/bookmarks_context';
import { useTheme } from '../../context/theme_context';


export default function TabLayout() {
  const { themeColors } = useTheme();
  return (
    <BookmarkProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: { flex: 0.1 },
          tabBarLabelStyle: { fontSize: 12, marginTop: 3 , marginBottom: -10},
          tabBarActiveTintColor: themeColors.light,
          tabBarInactiveTintColor: themeColors.dark,
          tabBarActiveBackgroundColor: themeColors.medLight,
          tabBarInactiveBackgroundColor: themeColors.medLight,
          tabBarLabelPosition: 'below-icon',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 3}}>
                <MaterialCommunityIcons
                  name={focused ? 'home' : 'home-outline'}
                  color={color}
                  size={29}
                />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="medicine"
          options={{
            title: 'Medicines',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 3}}>
                <Ionicons
                  name={focused ? 'list-sharp' : 'list-outline'}
                  color={color}
                  size={30}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: 'Bookmarks',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 3}}>
                <MaterialCommunityIcons
                  name={focused ? 'bookmark' : 'bookmark-outline'}
                  color={color}
                  size={27}
                />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="app_settings"
          options={{
            title: 'Settings',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 3}}>
                <Ionicons
                  name={focused ? 'settings-sharp' : 'settings-outline'}
                  color={color}
                  size={27}
                />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="about_us"
          options={({
            href: null,
            headerShown: false,
          })}
        />
        <Tabs.Screen
          name="appearance"
          options={({
            href: null,
            headerShown: false,
          })}
        />
        <Tabs.Screen
          name="permissions"
          options={({
            href: null,
            headerShown: false,
          })}
        />
        <Tabs.Screen
          name="recall_history"
          options={({
            href: null,
            headerShown: false,
          })}
        />
        <Tabs.Screen
          name="privacy_policy"
          options={({
            href: null,
            headerShown: false,
          })}
        />
        <Tabs.Screen
          name="medicine_info"
          options={({
            href: null,
            headerShown: false,
          })}
        />
        <Tabs.Screen
          name="splash_page"
          options={({
            href: null,
            headerShown: false,
          })}
        />
      </Tabs>
    </BookmarkProvider>
  );
}
