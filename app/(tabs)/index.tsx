import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { API_BASE_URL } from '../../config'; // adjust path accordingly
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

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
  const [searchQuery, setSearchQuery] = useState('');

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
      <TouchableOpacity
          style={styles.searchInput}
          onPress={() => router.push('/medicine')}
          activeOpacity={0.8}
        >
          <Text style={styles.searchPlaceholder}>Search Medicine</Text>
      </TouchableOpacity>

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
          <MaterialCommunityIcons name="barcode-scan" size={300} color="#336699" />
          <Text style={styles.scanText}>Tap the scanner to scan a barcode, or use the search box above to search by name.</Text>
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
    width: '95%',
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
  },
  searchInput: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    marginBottom: 16,
    width: '95%', 
    alignSelf: 'center', 
  },
  barcodeWrapper: {
    alignItems: 'center',
  },
  scanText: {
    marginTop: 16,
    fontSize: 23,
    color: '#336699',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20, 
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
  searchPlaceholder: {
    color: '#888',
    fontSize: 16,
  },

});
