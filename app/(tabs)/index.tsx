import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="barcode-scan" size={135} color="white" />
    <Button
    title='Scan a Barcode' 
    onPress={() => router.navigate('/camera')}
    color = '#99CCFF'
    ></Button>;
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#336699',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#99CCFF',
  },
});