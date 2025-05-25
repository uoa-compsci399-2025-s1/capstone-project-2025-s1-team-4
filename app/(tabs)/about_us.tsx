import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../context/theme_context'

const AboutUsScreen = () => {
  const { themeStyles, textSize } = useTheme()

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={styles.pageTitleWrapper}>
        <Text style={[styles.pageTitleText, themeStyles.text]}>About Us</Text>
      </View>

      <Text style={[styles.bodyText, themeStyles.text, { fontSize: textSize }]}>
        We are Six Degrees of Computation — a team of motivated and knowledgeable students with diverse backgrounds and experiences. Through MediDex, we aim to streamline access to medical information for prescription and over-the-counter medicines in Aotearoa New Zealand, by presenting information from reliable and regulated sources, such as MedSafe, in an accessible, user-friendly and convenient way to all Kiwis.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    flexGrow: 1
  },
  pageTitleWrapper: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 23
  },
  pageTitleText: {
    fontSize: 40,
    color: '#336699'
  },
  bodyText: {
    textAlign: 'center',
    marginTop: 20
  }
})

export default AboutUsScreen