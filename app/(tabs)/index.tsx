import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as Network from 'expo-network';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from '../../config';
import { useTheme } from '../../context/theme_context';

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
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showOfflineCard, setShowOfflineCard] = useState(false);
  const [showCameraAlert, setShowCameraAlert] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setIsConnected(networkState.isConnected === true && networkState.isInternetReachable === true);
      } catch (error) {
        console.error('Failed to check network status:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!isConnected) {
      timeout = setTimeout(() => {
        setShowOfflineCard(true);
      }, 1000);
    } else {
      setShowOfflineCard(false);
      if (timeout) clearTimeout(timeout);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isConnected]);

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

  async function handleBarcodeScanned({ data }: { data: string }) {
    if (scanning) return;

    setScanning(true);
    setScannedData(data);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

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
          router.push(`/medicine_info?barcode=${encodeURIComponent(data)}` as const);
        } else {
          setMedicineInfo(null);
          setMessage('Medicine not found');
          setScannedData(null);
          setTimeout(() => setMessage(null), 2000);
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
      <Image
        source={
          theme === 'dark'
            ? require('../../assets/icons/mediDex-dark.png')
            : require('../../assets/icons/mediDex-light.png')
        }
        style={{
          width: '95%',
          height: '15%',
          minHeight: 150,
          maxHeight: 150,
          marginBottom: 10,
          marginTop: 0,
          borderRadius: 10,
          resizeMode: 'contain'
        }}
      />

      <TouchableOpacity
        style={[styles.searchInput, themeStyles.card]}
        onPress={() => router.push({ pathname: '/medicine', params: { focusSearch: 'true' } })}
        activeOpacity={0.8}
      >
        <Text style={[styles.searchPlaceholder, themeStyles.transparentText, { fontSize: textSize }]}>Search Medicines</Text>
      </TouchableOpacity>

      {!cameraVisible && (
        <TouchableOpacity
          onPress={async () => {
            const allowed = await AsyncStorage.getItem('cameraEnabled');
            if (allowed !== 'true') {
              setShowCameraAlert(true);
              return;
            }

            setCameraVisible(true);
          }}
          style={styles.barcodeWrapper}
        >
          <View style={{ marginTop: 20, marginBottom: 20, paddingTop: 10, paddingBottom: 10, width: 250 }}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={230}
              color={themeColors.iconColor}
              style={{ alignSelf: 'center' }}
            />
          </View>

          <Text style={[styles.scanText, themeStyles.text]}>
            Tap the scanner icon to scan a barcode, or use the search box above to search by name.
          </Text>
        </TouchableOpacity>
      )}

      {cameraVisible && permission?.granted && isConnected ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
            onBarcodeScanned={scannedData || scanning ? undefined : handleBarcodeScanned}
          />
        </View>
      ) : cameraVisible && showOfflineCard ? (
        <View style={[styles.networkBox, themeStyles.card]}>
          <Text style={[styles.scanText, themeStyles.text]}>No internet connection</Text>
        </View>
      ) : null}

      {message && (
        <View style={styles.infoBox}>
          <Text style={styles.scanText}>{message}</Text>
        </View>
      )}

      {/* Camera Disabled Modal */}
      <Modal transparent visible={showCameraAlert}>
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
        }}>
          <View style={{
            backgroundColor: theme === 'dark' ? '#000' : '#fff',
            padding: 20,
            borderRadius: 10,
            width: '90%',
            maxWidth: 400,
          }}>
            <Text style={{
              color: theme === 'dark' ? '#fff' : '#000',
              fontSize: 18,
              marginBottom: 5,
              fontWeight: 'bold'
            }}>
              Camera Disabled
            </Text>
            <Text style={{
              color: theme === 'dark' ? '#ccc' : '#333',
              marginBottom: 20
            }}>
              Enable camera usage in Settings {'>'} Permissions.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setShowCameraAlert(false)}>
                <Text style={{ color: '#007AFF' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 11,
    paddingTop: 50,
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: 'white',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 23,
    marginBottom: 0,
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
  },
  barcodeWrapper: {
    alignItems: 'center',
  },
  scanText: {
    marginTop: 0,
    fontSize: 20,
    color: '#336699',
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 0,
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
    marginTop: 10,
    padding: 16,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  networkBox: {
    backgroundColor: '#e6f0ff',
    marginTop: 150,
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