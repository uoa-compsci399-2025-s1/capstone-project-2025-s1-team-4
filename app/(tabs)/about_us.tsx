import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/theme_context';

const AboutUsScreen = () => {
  const { themeStyles, textSize } = useTheme()

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={styles.pageTitleWrapper}>
        <Text style={[styles.pageTitleText, themeStyles.text]}>About Us</Text>
      </View>

      <ScrollView style={{ paddingTop: 10 }}>
        {/* About Us Content Inside Card */}

      <View style={[styles.infoCard, themeStyles.card]}>
          <Text style={[styles.subHeaderText, themeStyles.text, { fontSize: textSize + 4 }]}>
            6 Degrees of Computation
          </Text>

          <Text style={[styles.headerText, themeStyles.text, { fontSize: textSize }]}>
            1. Who We Are
          </Text>

        <Text style={[styles.bodyText, themeStyles.bodyText, { fontSize: textSize }]}>
          We are a team of motivated, knowledgeable individuals with diverse backgrounds and experiences united by our goal to make medical information more accessible to the public.
        </Text>

        <Text style={[styles.headerText, themeStyles.text, { fontSize: textSize }]}>
          2. Our Goals
        </Text>

          <Text style={[styles.bodyText, themeStyles.bodyText, { fontSize: textSize }]}>
            Want to know everything about a particular medicine but don't know where to start? We designed and developed MediDex to streamline access to medical information on over-the-counter medicines in Aotearoa New Zealand. We aim to provide accurate, independent, and comprehensive medical information at your fingertips.
        </Text>

          <Text style={[styles.headerText, themeStyles.text, { fontSize: textSize }]}>
            3. The Problem MediDex Solves
          </Text>

          <Text style={[styles.bodyText, themeStyles.bodyText, { fontSize: textSize }]}>
          We know your time is precious. Researching information about a medicine can often feel overwhelming. You must usually dig through pages full of dense, tightly packed text. MediDex retrieves medicine information right after you scan/enter a medicine's name from the label. MediDex has categorised and formatted the content clearly and intuitively, so you won't feel bombarded when looking for what matters most.
        </Text>

          <Text style={[styles.headerText, themeStyles.text, { fontSize: textSize }]}>
            4. Features Designed for You
          </Text>

        <Text style={[styles.bodyText, themeStyles.bodyText, { fontSize: textSize }]}>
          We wanted to create a medium that is accessible, user-friendly and convenient to all Kiwis. MediDex offers a range of features to make your medicine research journey smoother. Whether you want to save and revisit medicine information, customise the appearance of MediDex to suit your preferences, or receive timely alerts about medicine recalls, 
        <Text style={[styles.headerText, themeStyles.text, { fontSize: textSize, fontStyle: 'italic' }]}>
          {"\n"} 
          {"\n"}MediDex is ready.
        </Text>
        </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f8ff',
    flex: 1,
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
    marginBottom: 18
  },
  pageTitleText: {
    fontSize: 40,
    color: '#336699',
    textAlign: 'center'
  },
  headerText: {
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "bold",
  },
  subHeaderText: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "bold",
    textDecorationLine: 'underline',
  },
  bodyText: {
    textAlign: 'left',
    marginBottom: 5,
    fontWeight: 'normal'
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    elevation: 3,
    marginBottom: 25,
    marginHorizontal: 4
  },
});

export default AboutUsScreen