/**
 * Permissions screen: allows revoking camera permissions in-app,
 * and disabling recall notifications (may need to be confirmed
 * within Android/iOS system settings).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/theme_context';

export default function PermissionsScreen() {
  const { themeStyles, textSize, theme } = useTheme();
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const loadPermissions = async () => {
      const load = async (key: string, setter: (val: boolean) => void) => {
        const stored = await AsyncStorage.getItem(key);
        const value = stored === null ? true : stored === 'true';
        setter(value);
        if (stored === null) await AsyncStorage.setItem(key, 'true');
      };
      await load('cameraEnabled', setCameraEnabled);
      await load('notificationsEnabled', setNotificationsEnabled);
    };
    loadPermissions();
    }, []);

  const handleToggle = async (type: 'camera' | 'notifications', value: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    if (type === 'camera') {
      setCameraEnabled(value);
      await AsyncStorage.setItem('cameraEnabled', value ? 'true' : 'false');
    } else {
      setNotificationsEnabled(value);
      await AsyncStorage.setItem('notificationsEnabled', value ? 'true' : 'false');
    }
  };

  return (
    <View style={[styles.container, themeStyles.container]}>

      <View style={styles.pageTitleWrapper}>
        <Text style={[styles.pageTitleText, themeStyles.text]}>Permissions</Text>
      </View>

      <TouchableOpacity
        style={[styles.permissionCard, themeStyles.card]}
        activeOpacity={0.8}
        onPress={() => handleToggle('camera', !cameraEnabled)}
      >
        <Text style={[styles.permissionLabel, themeStyles.text, { fontSize: textSize }]}>Camera</Text>
        <Switch
          value={cameraEnabled}
          onValueChange={(val) => handleToggle('camera', val)}
          thumbColor="#ffffff"
          trackColor={{
            false: theme === 'dark' ? '#444' : '#adadad',
            true: theme === 'dark' ? '#002c59' : '#336699',
          }}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <Text style={[styles.bodyText, themeStyles.text, { fontSize: textSize }]}>
        Camera must be enabled to scan barcodes, although MediDex is still useable without camera access through manual searching.
        To revoke camera permissions from MediDex, update permissions in your device settings.
      </Text>

      <TouchableOpacity
        style={[styles.permissionCard, themeStyles.card]}
        activeOpacity={0.8}
        onPress={() => handleToggle('notifications', !notificationsEnabled)}
      >
        <Text style={[styles.permissionLabel, themeStyles.text, { fontSize: textSize }]}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(val) => handleToggle('notifications', val)}
          thumbColor="#ffffff"
          trackColor={{
            false: theme === 'dark' ? '#444' : '#adadad',
            true: theme === 'dark' ? '#002c59' : '#336699',
          }}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <Text style={[styles.bodyText, themeStyles.text, { fontSize: textSize }]}>
        MediDex will only notify you if there is a medicine recall. To revoke notification permissions from MediDex, update permissions in your device settings.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    flexGrow: 1},
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 13},
  pageTitleText: {
    fontSize: 40,
    color: '#336699'},
  bodyText: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20},
  permissionCard: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'},
  permissionLabel: {
    fontSize: 16,
    color: '#336699'}});
