import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Animated, Platform } from 'react-native';
import { useTheme } from '../../context/theme_context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const PermissionsScreen = () => {
  const { themeStyles, textSize } = useTheme();
  const router = useRouter();
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadPermissions = async () => {
      const savedCamera = await AsyncStorage.getItem('cameraEnabled');
      const savedNotifications = await AsyncStorage.getItem('notificationsEnabled');

      if (savedCamera === null) {
        setCameraEnabled(true);
        await AsyncStorage.setItem('cameraEnabled', 'true');
      } else {
        setCameraEnabled(savedCamera === 'true');
      }

      if (savedNotifications === null) {
        setNotificationsEnabled(true);
        await AsyncStorage.setItem('notificationsEnabled', 'true');
      } else {
        setNotificationsEnabled(savedNotifications === 'true');
      }
    };
    loadPermissions();
  }, []);

  const animateCard = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.98, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleToggle = async (type: 'camera' | 'notifications', value: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    animateCard();
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
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={40} color="#336699" />
      </TouchableOpacity>

      <View style={styles.pageTitleWrapper}>
        <Text style={[styles.pageTitleText, themeStyles.text]}>Permissions</Text>
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.permissionCard}
          activeOpacity={0.8}
          onPress={() => handleToggle('camera', !cameraEnabled)}
        >
          <Text style={[styles.permissionLabel, themeStyles.text]}>Camera</Text>
          <Switch
            value={cameraEnabled}
            onValueChange={(val) => handleToggle('camera', val)}
            thumbColor={cameraEnabled ? '#fff' : '#fff'}
            trackColor={{ false: '#ccc', true: '#336699' }}
            pointerEvents="none"
          />
        </TouchableOpacity>
      </Animated.View>

      <Text style={[styles.bodyText, themeStyles.text, { fontSize: textSize }]}>
        Camera must be enabled to scan barcodes, although MediDex is still useable without camera access through manual searching.
        To revoke camera permissions from MediDex, update permissions in your device settings.
      </Text>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.permissionCard}
          activeOpacity={0.8}
          onPress={() => handleToggle('notifications', !notificationsEnabled)}
        >
          <Text style={[styles.permissionLabel, themeStyles.text]}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(val) => handleToggle('notifications', val)}
            thumbColor={notificationsEnabled ? '#fff' : '#fff'}
            trackColor={{ false: '#ccc', true: '#336699' }}
            pointerEvents="none"
          />
        </TouchableOpacity>
      </Animated.View>

      <Text style={[styles.bodyText, themeStyles.text, { fontSize: textSize }]}>
        MediDex will only notify you if there is a medicine recall. To revoke notification access, update your device settings.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
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
    marginTop: 60,
    marginBottom: 13,
  },
  pageTitleText: {
    fontSize: 40,
    color: '#336699',
  },
  bodyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  permissionCard: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  permissionLabel: {
    fontSize: 16,
    color: '#336699',
  },
});

export default PermissionsScreen;