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
        tabBarActiveTintColor: '#99CCFF'
        }}>
            <Tabs.Screen
            name="index"
            options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <Feather name='home' color={'#336699'} size={23} />
                ),
            }}
            />
            <Tabs.Screen
            name="camera"
            options={{
                title: 'Scan',
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name='barcode-scan' color={'#336699'} size={23} />
                ),
            }}
            />
            <Tabs.Screen
            name="scan_result"
            options={{
                title: 'Results',
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <Feather name='list' color={'#336699'} size={23} />
                ),
            }}
            />
            <Tabs.Screen
            name="app_settings"
            options={{
                title: 'Settings',
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                    <Feather name='settings' color={'#336699'} size={23} />
                ),
            }}
            />
        </Tabs>
    );
}