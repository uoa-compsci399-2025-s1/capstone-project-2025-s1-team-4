import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="camera" size={32} color="white" />
    <Button
    title='Load Camera' 
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