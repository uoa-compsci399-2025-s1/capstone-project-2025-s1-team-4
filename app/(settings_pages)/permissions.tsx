import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTheme } from '../../context/theme_context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';

const PermissionsScreen = () => {
  const { themeStyles, textSize } = useTheme();
  const router = useRouter();
  const [cameraEnabled, setCameraEnabled] = useState(false);

 useEffect(() => {
  const checkPermission = async () => {
    const { status } = await Camera.getCameraPermissionsAsync(); 
    setCameraEnabled(status === 'granted');
  };
  checkPermission();
}, []);

const handleToggle = async (value: boolean) => {
  if (value) {
    const { status } = await Camera.requestCameraPermissionsAsync(); 
    if (status === 'granted') {
      setCameraEnabled(true);
    } else {
      setCameraEnabled(false);
      Alert.alert(
        'Permission Denied',
        'Camera access was denied. You can still use the app with manual search.'
      );
    }
  } else {
    setCameraEnabled(false);
  }
};

  return (
    <View style={[styles.container, themeStyles.container]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={40} color="#336699" />
      </TouchableOpacity>

      <View style={styles.pageTitleWrapper}>
        <Text style={[styles.pageTitleText, themeStyles.text]}>
          Permissions
        </Text>
      </View>

      <View style={styles.permissionCard}>
        <Text style={[styles.permissionLabel, themeStyles.text]}>
          Camera
        </Text>
        <Switch
          value={cameraEnabled}
          onValueChange={handleToggle}
          thumbColor={cameraEnabled ? '#fff' : '#fff'}
          trackColor={{ false: '#ccc', true: '#336699' }}
        />
      </View>

      <Text style={[styles.bodyText, themeStyles.text, { fontSize: textSize }]}>
        Access to camera is required to scan barcodes, although MediDex is still useable without camera access through manual searching.
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
