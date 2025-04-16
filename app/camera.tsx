import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [medicineInfo, setMedicineInfo] = useState<any>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera for barcode scanning</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function handleBarcodeScanned({ data }: { data: string }) {
    setScannedData(data);
    //alert(`Scanned barcode data: ${data}`);

    fetch(`http://192.168.68.104:5000/medicine?barcode=${encodeURIComponent(data)}`)
    .then((response) => {
      if (!response.ok) {
        // Handle non-200 status code
        if (response.status === 404) {
          console.log('No medicine found for barcode');
          setMedicineInfo(null); // Clear previous info or set appropriate message
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      console.log('Medicine response:', json);
      if (json.found) {
        setMedicineInfo(json.medicine);
      } else {
        setMedicineInfo(null);
        alert(json.message || 'Medicine not found');
      }
    })
    .catch((error) => {
      console.error('Fetch error:', error);
    });
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} barcodeScannerSettings={{
        barcodeTypes: ['ean13']}}
      onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned}>
      </CameraView>
      {scannedData && (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Scanned: {scannedData}</Text>
        <Button title="Reset Scanner" onPress={() => setScannedData(null)} />
      </View>
    )}

      {medicineInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Name: {medicineInfo.name}</Text>
          <Text style={styles.infoText}>Company: {medicineInfo.company}</Text>
          <Text style={styles.infoText}>Dosage: {medicineInfo.dosage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#336699'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    width: '90%',
    height: '50%',
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#99CCFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoText: { fontSize: 16, marginBottom: 4 },
  infoContainer: {
    position: 'absolute',
    top: 60, // distance from the top of the screen
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});