import { View, Text, StyleSheet } from 'react-native';

export default function BookmarksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Bookmarks</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#336699',
  },
});