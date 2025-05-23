import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { API_BASE_URL } from '../../config'; 
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useTheme } from '../../context/theme_context'
import {Image } from 'react-native';
import Slider from '@react-native-assets/slider'; 


type Medicine = {
  id: number;
  name: string;
  company: string;
  dosage: string;
};

export default function Index() {
  const router = useRouter();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [facing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [medicineInfo, setMedicineInfo] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const { theme, setTheme, textSize, setTextSize, themeStyles, themeColors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      return () => {
        setCameraVisible(false);
        setScannedData(null);
        setMedicineInfo(null);
        setMessage(null);
      };
    }, [])
  );

  function handleBarcodeScanned({ data }: { data: string }) {
    if (scanning) return;
  
    setScanning(true);
    setScannedData(data);
  
    fetch(`${API_BASE_URL}/medicine?barcode=${encodeURIComponent(data)}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            setMedicineInfo(null);
            setScannedData(null);
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        // Show cmi page
        router.push(`/medicine_info?barcode=${encodeURIComponent(data)}` as const);
        if (json.found) {
          console.log(json.medicine)
          setMedicineInfo(json.medicine);
          setMessage(null);
        } else {
          setMedicineInfo(null);
          setMessage('Medicine not found');
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      })
      .finally(() => {
        setScanning(false);
      });
  }
  

  return (
  <View style={[styles.container, themeStyles.container]}>
    {/* Logo Icon Header */}
    <Image source={require('../../assets/icons/ios-logo-light.png')} style={{ 
      width: 95,
      height: 90,
      marginBottom: 50,
      marginTop: 10,
      borderRadius: 10
      }} />

    {/* Search Box */}
    <TouchableOpacity
      style={[styles.searchInput, themeStyles.card]}
      onPress={() => router.push({ pathname: '/medicine', params: { focusSearch: 'true' } })}
      activeOpacity={0.8}
    >
      <Text style={[styles.searchPlaceholder, themeStyles.transparentText, { fontSize: textSize }]}>Search Medicines</Text>
    </TouchableOpacity>

    {/* Barcode Scanner Icon */}
    {!cameraVisible && (
  <TouchableOpacity
    onPress={async () => {
      const allowed = await AsyncStorage.getItem('cameraEnabled');
      if (allowed !== 'true') {
        Alert.alert('Camera Disabled', 'Enable camera usage in Settings > Permissions.');
        return;
      }

      setCameraVisible(true);
    }}
    style={styles.barcodeWrapper}
  >
    <View style={{ marginTop: 20, marginBottom: 20, paddingTop: 20, paddingBottom: 20, width: 250 }}>
      <MaterialCommunityIcons
        name="barcode-scan"
        size={230} // Controls the icon size
        color={themeColors.iconColor}
        style={{ alignSelf: 'center' }} // Optional: center icon within the View
      />
    </View>

    <Text style={[styles.scanText, themeStyles.text]}>
      Tap the scanner icon to scan a barcode, or use the search box above to search by name.
    </Text>
  </TouchableOpacity>
)}

    {cameraVisible && permission?.granted && (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
          onBarcodeScanned={scannedData || scanning ? undefined : handleBarcodeScanned}
        />
      </View>
    )}

    {message && (
      <View style={styles.infoBox}>
        <Text style={styles.scanText}>{message}</Text>
      </View>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 11,
    paddingTop: 50,
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  searchBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: 360,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'white',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 23,
    marginBottom: 12,
    marginTop: 12,
    width: '95%', 
    alignSelf: 'center', 
  },
  barcodeWrapper: {
    alignItems: 'center',
  },
  scanText: {
    marginTop: 16,
    fontSize: 20,
    color: '#336699',
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 15, 
  },
  cameraContainer: {
    width: '90%',
    height: 300,
    marginTop: 50,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#e6f0ff',
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  searchPlaceholder: {
    color: '#888',
    fontSize: 16,
  },

});