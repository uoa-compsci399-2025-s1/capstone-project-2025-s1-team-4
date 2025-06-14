/**
 * Manual splash screen for both Android and iOS. Time delay can be
 * adjusted; currently set for 2 seconds to allow for slow server
 * wakeup period/load on initial launch.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/theme_context';

export default function SplashScreen({ onFadeComplete }: { onFadeComplete?: () => void }) {
    const { resolvedTheme, themeStyles } = useTheme();
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const timeout = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                if (onFadeComplete) onFadeComplete();
            });
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={[styles.container, themeStyles.container]}>
            <Animated.Image
                source={
                    resolvedTheme === 'dark'
                        ? require('../../assets/images/splashIconDark.png')
                        : require('../../assets/images/splashIconLight.png')
                }
                style={[styles.logo, { opacity: fadeAnim }]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10},
    logo: {
        width: '90%',
        marginBottom: 20,
    }});
