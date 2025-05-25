import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useTheme } from '../../context/theme_context'

export default function SplashScreen({ onFadeComplete }: { onFadeComplete?: () => void }) {
  const { theme, themeStyles } = useTheme()
  const fadeAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(() => {
        if (onFadeComplete) onFadeComplete()
      })
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Animated.Image
        source={
          theme === 'dark'
            ? require('../../assets/images/splashIconDark.png')
            : require('../../assets/images/splashIconLight.png')
        }
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  logo: {
    width: '90%',
    marginBottom: 20
  }
})
