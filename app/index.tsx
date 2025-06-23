import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const images = [
  require('../assets/images/slide1.png'),
  require('../assets/images/slide2.png'),
  require('../assets/images/slide3.png'),
  require('../assets/images/slide4.png'),
];

export default function Welcome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Change image
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handleGetStarted = () => {
    router.push('/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
        translucent={false}
      />
      
      <View style={styles.content}>
        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to</Text>
          <Text style={styles.appTitle}>Nepal Citizen Services</Text>
          <Text style={styles.welcomeSubtitle}>
            Your gateway to seamless government services
          </Text>
        </View>

        {/* Image Slider */}
        <View style={styles.imageContainer}>
          <Animated.View style={[styles.imageWrapper, { opacity: fadeAnim }]}>
            <Image
              source={images[currentIndex]}
              style={styles.slideImage}
              resizeMode="contain"
            />
          </Animated.View>
          
          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Get Started Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <View style={styles.buttonContent}>
              <Text style={styles.getStartedButtonText}>Get Started</Text>
              <Ionicons 
                name="arrow-forward" 
                size={moderateScale(20)} 
                color="#ffffff" 
                style={styles.arrowIcon}
              />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.footerText}>
            Join thousands of citizens using our services
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(40), // Reduced since no header needed
    paddingBottom: verticalScale(30),
    justifyContent: 'space-between',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
    marginTop: verticalScale(40), // Added extra top margin for more gap
  },
  welcomeTitle: {
    fontSize: moderateScale(24),
    textAlign: 'center',
    color: '#4b5563',
    fontWeight: '300',
    marginBottom: verticalScale(5),
  },
  appTitle: {
    fontSize: moderateScale(32),
    textAlign: 'center',
    color: '#065f46',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: verticalScale(15),
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  welcomeSubtitle: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: moderateScale(22),
    paddingHorizontal: scale(20),
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: verticalScale(20),
  },
  imageWrapper: {
    width: scale(280),
    height: verticalScale(280),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fffe',
    borderRadius: moderateScale(20),
    // Conditional shadow - only for iOS
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }),
    // No elevation for Android
    ...(Platform.OS === 'android' && {
      elevation: 0,
    }),
  },
  slideImage: {
    width: scale(240),
    height: verticalScale(240),
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(30),
  },
  dot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    marginHorizontal: scale(5),
  },
  activeDot: {
    backgroundColor: '#059669',
    width: scale(24),
    borderRadius: scale(12),
  },
  inactiveDot: {
    backgroundColor: '#d1d5db',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  getStartedButton: {
    backgroundColor: '#059669',
    borderRadius: moderateScale(30),
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(60),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: verticalScale(15),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(20),
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  arrowIcon: {
    marginLeft: scale(8),
  },
  footerText: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});