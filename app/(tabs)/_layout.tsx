import { Stack, Tabs } from "expo-router";
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarStyle: {
                height: 70
            },
        tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 2
        },
        tabBarActiveTintColor: '#99CCFF',
        tabBarInactiveTintColor: '#336699',
        tabBarLabelPosition: 'below-icon'
        }}>
            <Tabs.Screen //Changes the header style
            name="index"
            options={{
                title: 'Home',
                headerShown: true,
                tabBarIcon: ({color, size}) => (
                    <Feather name='home' color={color} size={23} />
                ),
            }}
            />
            <Tabs.Screen
            name="medicine"
            options={{
                title: 'Medicine',
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name="pill" color={color} size={23} />
                ),
            }}
            />
            <Tabs.Screen
            name="bookmarks"
            options={{
                title: 'Bookmarks',
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name="bookmark" color={color} size={23} />
                ),
            }}
            />
            <Tabs.Screen
            name="app_settings"
            options={{
                title: 'Settings',
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <Feather name='settings' color={color} size={23} />
                ),
            }}
            />
        </Tabs>
    );
}