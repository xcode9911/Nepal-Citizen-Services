import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Index() {
  const [citizenshipNumber, setCitizenshipNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = () => {
    // Handle registration logic here
    console.log('Register pressed');
    console.log('Citizenship Number:', citizenshipNumber);
    console.log('Email:', email);
    router.push("/otp");
  };

  const handleLogin = () => {
    // Handle navigation to login screen
    router.push("/login");
  };

  const handleGoBack = () => {
    // Navigate back to previous screen
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback navigation if no previous screen
      router.push('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
        translucent={false}
      />
      
      {/* Back Button Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons 
            name="arrow-back" 
            size={moderateScale(24)} 
            color="#059669" 
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/Logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            
            {/* App Title */}
            <Text style={styles.titleMain}>Nepal Citizen</Text>
            <Text style={styles.titleSub}>Services</Text>
            
            {/* Main Heading */}
            <Text style={styles.heading}>Get registered with us</Text>
            
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Enter your valid credentials{'\n'}carefully
            </Text>
            
            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Citizenship Number Field */}
              <Text style={styles.label}>Citizenship Number:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your citizenship number"
                placeholderTextColor="#6b7280"
                value={citizenshipNumber}
                onChangeText={setCitizenshipNumber}
                keyboardType="numeric"
              />
              
              {/* Email Field */}
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Register Button */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
            
            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already registered? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background for both iOS and Android
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight || verticalScale(10) : verticalScale(10),
    left: scale(20),
    zIndex: 100,
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20), 
    paddingBottom: verticalScale(20),
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
  logo: {
    width: scale(150),
    height: scale(150),
  },
  titleMain: {
    fontSize: moderateScale(28),
    textAlign: 'center',
    color: '#065f46', // Dark mint green
    fontWeight: '300',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: verticalScale(3),
  },
  titleSub: {
    fontSize: moderateScale(28),
    textAlign: 'center',
    color: '#065f46', // Dark mint green
    fontWeight: '300',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: verticalScale(15),
  },
  heading: {
    fontSize: moderateScale(24),
    fontWeight: '600',
    textAlign: 'center',
    color: '#059669', // Medium mint green for heading
    marginBottom: verticalScale(12),
  },
  subtitle: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: verticalScale(20),
    lineHeight: moderateScale(22),
  },
  formContainer: {
    marginBottom: verticalScale(30),
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#065f46', // Dark mint green for labels
    marginBottom: verticalScale(8),
    marginTop: verticalScale(12),
  },
  input: {
    backgroundColor: '#d1fae5', // Light mint green input background
    borderRadius: moderateScale(25),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    fontSize: moderateScale(16),
    color: '#065f46', // Dark mint green for input text
    width: '100%',
    minHeight: verticalScale(50),
    borderWidth: 1,
    borderColor: '#a7f3d0', // Mint green border
  },
  registerButton: {
    backgroundColor: '#059669', // Mint green button
    borderRadius: moderateScale(25),
    paddingVertical: verticalScale(16),
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    minHeight: verticalScale(50),
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
  },
  loginText: {
    fontSize: moderateScale(16),
    color: '#4b5563',
  },
  loginLink: {
    fontSize: moderateScale(16),
    color: '#059669', // Mint green link color
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});