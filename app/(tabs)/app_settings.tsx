import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>App Settings</Text>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Appearance</Text>
        <Feather name="chevron-right" size={20} color="#336699" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Notification History</Text>
        <Feather name="chevron-right" size={20} color="#336699" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Permissions</Text>
        <Feather name="chevron-right" size={20} color="#336699" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Clear Bookmarks</Text>
        <Feather name="chevron-right" size={20} color="#336699" />
      </TouchableOpacity>


      <Text style={styles.sectionHeader}>About</Text>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>About Us</Text>
        <Feather name="chevron-right" size={20} color="#336699" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Privacy Policy</Text>
        <Feather name="chevron-right" size={20} color="#336699" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>App Version</Text>
        <Text style={styles.settingValue}>v1.0.0</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f8ff',
      padding: 20,
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#336699',
      marginTop: 24,
      marginBottom: 12,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    settingText: {
      fontSize: 16,
      color: '#333',
    },
    settingValue: {
      fontSize: 16,
      color: '#336699',
      fontWeight: 'bold',
    },
  });
  