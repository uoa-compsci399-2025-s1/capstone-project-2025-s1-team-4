import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Link, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config'; // adjust path accordingly
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';


// Define the medicine type
type Medicine = {
  id: number;
  name: string;
  company: string;
  dosage: string;
};

export default function Index() {
  const router = useRouter();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [medicineInfo, setMedicineInfo] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      // When Home screen is focused, do nothing special.
      return () => {
        // When navigating away from Home, turn off the camera & reset scanner state
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
        if (json.found) {
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
    <View style={styles.container}>
      {/* Pill Icon Header */}
      <View style={styles.header}>
        <Ionicons name="medkit" size={36} color="#336699" />
      </View>
  
      {/* Search Box */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search here"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
      </View>
  
      {/* Barcode Scanner Icon */}
      {/* Barcode Scanner Icon - only show if camera is not visible */}
      {!cameraVisible && (
        <TouchableOpacity
          onPress={async () => {
            if (!permission?.granted) {
              const { granted } = await requestPermission();
              if (!granted) return;
            }
            setCameraVisible(true);
          }}
          style={styles.barcodeWrapper}
        >
          <MaterialCommunityIcons name="barcode-scan" size={130} color="#336699" />
          <Text style={styles.scanText}>Click Scanner To Scan Medicine Barcode</Text>
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

      {medicineInfo && (
        <View style={styles.infoBox}>
          <Text style={styles.scanText}>Name: {medicineInfo.name}</Text>
          <Text style={styles.scanText}>Company: {medicineInfo.company}</Text>
          <Text style={styles.scanText}>Dosage: {medicineInfo.dosage}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  searchBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
  },
  barcodeWrapper: {
    alignItems: 'center',
  },
  scanText: {
    marginTop: 16,
    fontSize: 16,
    color: '#336699',
    fontWeight: 'bold',
    textAlign: 'center',
    width: 220,
  },
  cameraContainer: {
    width: '90%',
    height: 300,
    marginTop: 20,
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
  
});
