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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function Login() {
  const [citizenshipNumber, setCitizenshipNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    if (!citizenshipNumber || !email) {
      Alert.alert('Missing Fields', 'Please enter both citizenship number and email.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          citizenshipNo: citizenshipNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Login Failed', data.message || 'Unable to login.');
        return;
      }

      // Navigate directly without showing success alert
      router.push({
        pathname: '/LoginOtp',
        params: { email, citizenshipNo: citizenshipNumber },
      });

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
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

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#059669" />
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
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/Logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.titleMain}>Nepal Citizen</Text>
            <Text style={styles.titleSub}>Services</Text>

            <Text style={styles.heading}>Welcome back</Text>

            <Text style={styles.subtitle}>
              Enter your credentials{'\n'}to access your account
            </Text>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Citizenship Number:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your citizenship number"
                placeholderTextColor="#6b7280"
                value={citizenshipNumber}
                onChangeText={setCitizenshipNumber}
                keyboardType="numeric"
              />

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

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Not registered yet? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Register now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    position: 'absolute',
    top:
      Platform.OS === 'android'
        ? StatusBar.currentHeight || verticalScale(10)
        : verticalScale(10),
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
  keyboardAvoidingView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(20),
    justifyContent: 'center',
  },
  logoContainer: { alignItems: 'center', marginBottom: verticalScale(5) },
  logo: { width: scale(150), height: scale(150) },
  titleMain: {
    fontSize: moderateScale(28),
    textAlign: 'center',
    color: '#065f46',
    fontWeight: '300',
    letterSpacing: 2,
    marginBottom: verticalScale(3),
  },
  titleSub: {
    fontSize: moderateScale(28),
    textAlign: 'center',
    color: '#065f46',
    fontWeight: '300',
    letterSpacing: 2,
    marginBottom: verticalScale(15),
  },
  heading: {
    fontSize: moderateScale(24),
    fontWeight: '600',
    textAlign: 'center',
    color: '#059669',
    marginBottom: verticalScale(12),
  },
  subtitle: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: verticalScale(20),
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
    color: '#065f46',
    marginBottom: verticalScale(8),
    marginTop: verticalScale(12),
  },
  input: {
    backgroundColor: '#d1fae5',
    borderRadius: moderateScale(25),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    fontSize: moderateScale(16),
    color: '#065f46',
    width: '100%',
    minHeight: verticalScale(50),
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  loginButton: {
    backgroundColor: '#059669',
    borderRadius: moderateScale(25),
    paddingVertical: verticalScale(16),
    marginBottom: verticalScale(20),
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    minHeight: verticalScale(50),
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
  },
  registerText: {
    fontSize: moderateScale(16),
    color: '#4b5563',
  },
  registerLink: {
    fontSize: moderateScale(16),
    color: '#059669',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
