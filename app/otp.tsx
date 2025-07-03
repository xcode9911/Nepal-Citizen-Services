import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
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

// Scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function OTP() {
  const { email, citizenshipNo } = useLocalSearchParams<{ email: string; citizenshipNo: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 5) {
      Alert.alert('Incomplete OTP', 'Please enter all 5 digits of the OTP.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users/verify-activation-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          citizenshipNo,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Verification Failed', data.message || 'Invalid or expired OTP.');
        return;
      }

      Alert.alert('Success', 'Account activated successfully!', [
        {
          text: 'Continue',
          onPress: () => router.push('/dashboard'),
        },
      ]);
    } catch (error) {
      console.error('OTP Verification Error:', error);
      Alert.alert('Error', 'Could not verify OTP. Please try again.');
    }
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      setTimer(60);
      setOtp(['', '', '', '', '']);
      inputRefs.current[0]?.focus();
      // Trigger resend logic here if implemented on backend
      Alert.alert('OTP Sent', 'A new OTP has been sent to your email.');
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
        translucent={false}
      />

      {/* Back Button */}
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
            <Text style={styles.heading}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 5-digit code sent to{'\n'}your registered email
            </Text>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
              {timer > 0 ? (
                <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResendOtp}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.verifyButton,
                !isOtpComplete && styles.verifyButtonDisabled,
              ]}
              onPress={handleVerifyOtp}
              disabled={!isOtpComplete}
            >
              <View style={styles.buttonContent}>
                <Text
                  style={[
                    styles.verifyButtonText,
                    !isOtpComplete && styles.verifyButtonTextDisabled,
                  ]}
                >
                  Verify OTP
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={moderateScale(20)}
                  color={isOtpComplete ? '#ffffff' : '#9ca3af'}
                  style={styles.verifyIcon}
                />
              </View>
            </TouchableOpacity>

            <Text style={styles.helpText}>
              Didn't receive the code? Check your spam folder.
            </Text>
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
  logo: { width: scale(120), height: scale(120) },
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
    marginBottom: verticalScale(25),
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
    marginBottom: verticalScale(30),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(25),
    gap: scale(12),
  },
  otpInput: {
    width: scale(50),
    height: verticalScale(60),
    backgroundColor: '#d1fae5',
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: '#a7f3d0',
    fontSize: moderateScale(24),
    fontWeight: '600',
    color: '#065f46',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#059669',
    backgroundColor: '#ecfdf5',
  },
  timerContainer: { alignItems: 'center', marginBottom: verticalScale(30) },
  timerText: { fontSize: moderateScale(14), color: '#6b7280' },
  resendText: {
    fontSize: moderateScale(14),
    color: '#059669',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  verifyButton: {
    backgroundColor: '#059669',
    borderRadius: moderateScale(25),
    paddingVertical: verticalScale(16),
    marginBottom: verticalScale(20),
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    minHeight: verticalScale(50),
    justifyContent: 'center',
  },
  verifyButtonDisabled: { backgroundColor: '#e5e7eb' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center',
  },
  verifyButtonTextDisabled: { color: '#9ca3af' },
  verifyIcon: { marginLeft: scale(8) },
  helpText: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    color: '#9ca3af',
    fontStyle: 'italic',
    paddingHorizontal: scale(20),
  },
});
