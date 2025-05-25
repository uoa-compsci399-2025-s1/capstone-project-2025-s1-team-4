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

          <Text style={[styles.headerText, themeStyles.text, { fontSize: textSize }]}>
            1. Who Are We
          </Text>

        <Text style={[styles.bodyText, themeStyles.bodyText, { fontSize: textSize }]}>
          We are a team of motivated, knowledgeable individuals with diverse backgrounds and experiences, united by our goal to make medical information more accessible to the public.
          {"\n"} {"\n"}
        </Text>

        <Text style={[styles.headerText, themeStyles.text, { fontSize: textSize }]}>
          2. Our Goals
        </Text>

          <Text style={[styles.bodyText, themeStyles.bodyText, { fontSize: textSize }]}>
            Want to know everything about a medicine but don't know where to start?

            {"\n"} {"\n"}
            That’s why we designed and developed MediDex to streamline access to medical information on over-the-counter medicines in Aotearoa New Zealand.
            {"\n"} {"\n"}

            We aim to provide accurate, independent, and comprehensive medicine information right at your fingertips.
          {"\n"} {"\n"}
        </Text>

          <Text style={[styles.headerText, themeStyles.text, { fontSize: textSize }]}>
            3. The Problem MediDex Solves
          </Text>

          <Text style={[styles.bodyText, themeStyles.bodyText, { fontSize: textSize }]}>
            We know your time is precious.{"\n"} {"\n"}

          Researching information about a medicine can often feel overwhelming. You often have to dig through pages full of dense, tightly packed text.
          {"\n"} {"\n"} 
          MediDex retrieves medicine information right after you scan/enter a medicine's name from the label.
          {"\n"} {"\n"} 
          MediDex has categorised and formatted the content clearly and intuitively, so you won’t feel bombarded when looking for what matters most.
          {"\n"} {"\n"}
        </Text>

          <Text style={[styles.headerText, themeStyles.text, { fontSize: textSize }]}>
            4. Features Designed for You
          </Text>

        <Text style={[styles.bodyText, themeStyles.bodyText, { fontSize: textSize }]}>
          We wanted to create a medium that is accessible, user-friendly and convenient to all Kiwis.{"\n"} {"\n"} 
          
          MediDex offers a range of features to make your medicine research journey smoother.
          Whether you want to save and revisit medicine information, customise the appearance of MediDex to suit your preferences, or receive timely alerts about medicine recalls, 
          
          {"\n"} 
          {"\n"}MediDex is ready.
        </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
    marginBottom: 23
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
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 25,
    marginHorizontal: 4
  },
});

export default AboutUsScreen