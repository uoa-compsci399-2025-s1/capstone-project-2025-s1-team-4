import { Router } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Tab() {
    return <View style={styles.container}> 
        <Text style={styles.headText}>
            Settings
        </Text>
    </View>
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#336699'
},
headText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#99CCFF'
}
})