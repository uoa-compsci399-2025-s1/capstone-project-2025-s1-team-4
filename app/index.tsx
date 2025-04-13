import { Text, View, StyleSheet, Button } from "react-native";
import { Link, useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
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