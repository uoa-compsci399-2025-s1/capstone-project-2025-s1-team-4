import { Router, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet } from 'react-native' 

export default function result() {
    const bc = useLocalSearchParams();
    const { barcode } = bc;
    return <View style={styles.container}>
        <Text style={styles.barcodeContainer}>
            barcode: { barcode }
        </Text>
    </View>
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: 'center'
},
barcodeContainer: {
    fontSize: 16,
    fontWeight: 'bold'
}
});