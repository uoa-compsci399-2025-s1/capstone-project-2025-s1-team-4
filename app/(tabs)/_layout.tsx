import { Tabs, Stack } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BookmarkProvider } from '../../context/bookmarks_context';


export default function TabLayout() {
  return (
    <BookmarkProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            height: 70
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 3,
          },
          tabBarActiveTintColor: '#336699',
          tabBarInactiveTintColor: '#99CCFF',
          tabBarLabelPosition: 'below-icon'
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'}
                color={color}
                size={29}
              />
            )
          }}
        />
        <Tabs.Screen
          name="medicine"
          options={{
            title: 'Medicine',
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'list-sharp' : 'list-outline'}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: 'Bookmarks',
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'bookmark' : 'bookmark-outline'}
                color={color}
                size={27}
              />
            )
          }}
        />
        <Tabs.Screen
          name="app_settings"
          options={{
            title: 'Settings',
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'settings-sharp' : 'settings-outline'}
                color={color}
                size={27}
              />
            )
          }}
        />
      </Tabs>
    </BookmarkProvider>
  );
}
