import { Text, View, StyleSheet, Button } from "react-native";
import { Link, useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
    <Button
    title='Load Camera'
    onPress={() => router.navigate('/camera')}
    ></Button>;
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});