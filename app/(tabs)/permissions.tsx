import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Haptics from 'expo-haptics'
import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '../../context/theme_context'

const PermissionsScreen = () => {
  const {themeStyles, textSize, theme} = useTheme()
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    const loadPermissions = async () => {
      const [savedCamera, savedNotifications] = await Promise.all([
        AsyncStorage.getItem('cameraEnabled'),
        AsyncStorage.getItem('notificationsEnabled')
      ])

      const cam = savedCamera === null ? true : savedCamera === 'true'
      const notif = savedNotifications === null ? true : savedNotifications === 'true'

      setCameraEnabled(cam)
      setNotificationsEnabled(notif)

      if (savedCamera === null)
        await AsyncStorage.setItem('cameraEnabled', 'true')
      if (savedNotifications === null)
        await AsyncStorage.setItem('notificationsEnabled', 'true')
    }

    loadPermissions()
  }, [])

  const handleToggle = async (type: 'camera' | 'notifications', value: boolean) => {
    if (Platform.OS !== 'web') await Haptics.selectionAsync()

    if (type === 'camera') {
      setCameraEnabled(value)
      await AsyncStorage.setItem('cameraEnabled', value.toString())
    } else {
      setNotificationsEnabled(value)
      await AsyncStorage.setItem('notificationsEnabled', value.toString())
    }
  }

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
        <Text style={[styles.permissionLabel, themeStyles.text, { fontSize: textSize }]}>
          Camera
        </Text>
        <Switch
          value={cameraEnabled}
          onValueChange={(val) => handleToggle('camera', val)}
          thumbColor="#ffffff"
          trackColor={{
            false: theme === 'dark' ? '#444' : '#adadad',
            true: theme === 'dark' ? '#002c59' : '#336699'
          }}
        />
      </TouchableOpacity>

      <Text style={[styles.bodyText, themeStyles.text, { fontSize: textSize }]}>
        Camera must be enabled to scan barcodes. You can still use MediDex manually without it.
        To revoke camera permissions, update settings in your device preferences.
      </Text>

      <TouchableOpacity
        style={[styles.permissionCard, themeStyles.card]}
        activeOpacity={0.8}
        onPress={() => handleToggle('notifications', !notificationsEnabled)}
      >
        <Text style={[styles.permissionLabel, themeStyles.text, { fontSize: textSize }]}>
          Notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(val) => handleToggle('notifications', val)}
          thumbColor="#ffffff"
          trackColor={{
            false: theme === 'dark' ? '#444' : '#adadad',
            true: theme === 'dark' ? '#002c59' : '#336699'
          }}
        />
      </TouchableOpacity>

      <Text style={[styles.bodyText, themeStyles.text, { fontSize: textSize }]}>
        MediDex only sends notifications if a medicine is recalled. Manage this in device settings.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    flexGrow: 1
  },
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20
  },
  pageTitleText: {
    fontSize: 40,
    color: '#336699'
  },
  bodyText: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24
  },
  permissionCard: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 12,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  permissionLabel: {
    fontSize: 16,
    color: '#336699'
  }
})

export default PermissionsScreen