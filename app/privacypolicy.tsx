import { router } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export default function PrivacyPolicy() {
  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
        translucent={false}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#065f46" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Demo Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <View style={styles.disclaimerIcon}>
            <Ionicons name="information-circle" size={moderateScale(24)} color="#f59e0b" />
          </View>
          <View style={styles.disclaimerContent}>
            <Text style={styles.disclaimerTitle}>Demo Application</Text>
            <Text style={styles.disclaimerText}>
              This is a demonstration app and not affiliated with any government entity. 
              This privacy policy is for demo purposes only.
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Last Updated */}
          <Text style={styles.lastUpdated}>Last updated: January 2024</Text>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.sectionText}>
              Welcome to Nepal Citizen Services Demo App ("we," "our," or "us"). This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our 
              mobile application. Please read this privacy policy carefully.
            </Text>
          </View>

          {/* Information We Collect */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information We Collect</Text>
            
            <Text style={styles.subsectionTitle}>Personal Information</Text>
            <Text style={styles.sectionText}>
              We may collect personal information that you voluntarily provide, including:
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Name and contact information</Text>
              <Text style={styles.bulletPoint}>• Citizenship number (demo purposes only)</Text>
              <Text style={styles.bulletPoint}>• Email address</Text>
              <Text style={styles.bulletPoint}>• Profile information</Text>
            </View>

            <Text style={styles.subsectionTitle}>Usage Information</Text>
            <Text style={styles.sectionText}>
              We automatically collect certain information about your device and usage:
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Device information and identifiers</Text>
              <Text style={styles.bulletPoint}>• App usage statistics</Text>
              <Text style={styles.bulletPoint}>• Log data and crash reports</Text>
            </View>
          </View>

          {/* How We Use Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              We use the collected information for demo purposes including:
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Providing app functionality demonstration</Text>
              <Text style={styles.bulletPoint}>• Improving user experience</Text>
              <Text style={styles.bulletPoint}>• Sending notifications (if enabled)</Text>
              <Text style={styles.bulletPoint}>• Technical support and maintenance</Text>
            </View>
          </View>

          {/* Information Sharing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information Sharing</Text>
            <Text style={styles.sectionText}>
              As this is a demo application, we do not share personal information with third parties. 
              In a real application, information sharing would be limited to:
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Service providers and partners</Text>
              <Text style={styles.bulletPoint}>• Legal compliance requirements</Text>
              <Text style={styles.bulletPoint}>• Business transfers (with consent)</Text>
            </View>
          </View>

          {/* Data Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Security</Text>
            <Text style={styles.sectionText}>
              We implement appropriate security measures to protect your information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method 
              of transmission over the internet is 100% secure.
            </Text>
          </View>

          {/* Your Rights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.sectionText}>
              You have the right to:
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Access your personal information</Text>
              <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
              <Text style={styles.bulletPoint}>• Delete your account and data</Text>
              <Text style={styles.bulletPoint}>• Opt-out of communications</Text>
            </View>
          </View>

          {/* Children's Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Children's Privacy</Text>
            <Text style={styles.sectionText}>
              Our app is not intended for children under 13. We do not knowingly collect 
              personal information from children under 13.
            </Text>
          </View>

          {/* Changes to Privacy Policy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
            <Text style={styles.sectionText}>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </Text>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have questions about this Privacy Policy, please contact us:
            </Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactItem}>📧 demo@nepalcitizenservices.com</Text>
              <Text style={styles.contactItem}>📱 +977-1-XXXXXXX</Text>
              <Text style={styles.contactItem}>📍 Demo Address, Kathmandu, Nepal</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: scale(8),
    width: scale(40),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#065f46',
    textAlign: 'center',
  },
  headerSpacer: {
    width: scale(40),
  },
  disclaimerContainer: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fbbf24',
    borderRadius: moderateScale(12),
    padding: scale(16),
    margin: scale(24),
    marginBottom: verticalScale(16),
  },
  disclaimerIcon: {
    marginRight: scale(12),
  },
  disclaimerContent: {
    flex: 1,
  },
  disclaimerTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#92400e',
    marginBottom: verticalScale(4),
  },
  disclaimerText: {
    fontSize: moderateScale(14),
    color: '#92400e',
    lineHeight: moderateScale(20),
  },
  content: {
    paddingHorizontal: scale(24),
  },
  lastUpdated: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: verticalScale(24),
    textAlign: 'center',
  },
  section: {
    marginBottom: verticalScale(32),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(12),
  },
  subsectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#059669',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  sectionText: {
    fontSize: moderateScale(16),
    color: '#374151',
    lineHeight: moderateScale(24),
    marginBottom: verticalScale(12),
  },
  bulletPoints: {
    marginLeft: scale(16),
    marginBottom: verticalScale(12),
  },
  bulletPoint: {
    fontSize: moderateScale(15),
    color: '#4b5563',
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(4),
  },
  contactInfo: {
    backgroundColor: '#f8fffe',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: scale(16),
    marginTop: verticalScale(12),
  },
  contactItem: {
    fontSize: moderateScale(15),
    color: '#065f46',
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(22),
  },
  bottomSpacing: {
    height: verticalScale(32),
  },
});