import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/theme_context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AboutUsScreen = () => {
  const { themeStyles, textSize } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, themeStyles.container]}>
      
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={40} color="#336699" />
      </TouchableOpacity>

      {/* Page Title */}
      <View style={styles.pageTitleWrapper}>
        <Text style={[styles.pageTitleText, themeStyles.text]}>
          About Us
        </Text>
      </View>

      {/* Page Content Placeholder */}
      <Text style={[styles.bodyText, themeStyles.text, { fontSize: textSize }]}>
        insert jargon here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 16,
    zIndex: 1,
  },
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 23,
  },
  pageTitleText: {
    fontSize: 40,
    color: '#336699',
  },
  bodyText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AboutUsScreen;