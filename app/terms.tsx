import { router } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
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

export default function TermsOfServicePage() {
  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Demo Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <View style={styles.disclaimerIcon}>
            <Ionicons name="warning" size={moderateScale(24)} color="#dc2626" />
          </View>
          <View style={styles.disclaimerContent}>
            <Text style={styles.disclaimerTitle}>Demo Application Notice</Text>
            <Text style={styles.disclaimerText}>
              This is a demonstration application only. These terms are for demo purposes 
              and do not constitute a real legal agreement with any government entity.
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Last Updated */}
          <Text style={styles.lastUpdated}>Last updated: January 2024</Text>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Agreement to Terms</Text>
            <Text style={styles.sectionText}>
              By accessing and using the Nepal Citizen Services Demo App ("Service"), you accept 
              and agree to be bound by the terms and provision of this agreement. This is a 
              demonstration application and not affiliated with any official government services.
            </Text>
          </View>

          {/* Use License */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Use License</Text>
            <Text style={styles.sectionText}>
              Permission is granted to temporarily use this demo application for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a 
              transfer of title, and under this license you may not:
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Modify or copy the materials</Text>
              <Text style={styles.bulletPoint}>• Use for commercial purposes</Text>
              <Text style={styles.bulletPoint}>• Attempt to reverse engineer the software</Text>
              <Text style={styles.bulletPoint}>• Remove copyright or proprietary notations</Text>
            </View>
          </View>

          {/* User Accounts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Accounts</Text>
            <Text style={styles.sectionText}>
              When you create an account with us, you must provide information that is accurate, 
              complete, and current at all times. You are responsible for safeguarding the password 
              and for all activities under your account.
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Keep your password secure and confidential</Text>
              <Text style={styles.bulletPoint}>• Notify us immediately of unauthorized use</Text>
              <Text style={styles.bulletPoint}>• Use only accurate and truthful information</Text>
            </View>
          </View>

          {/* Acceptable Use */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Acceptable Use</Text>
            <Text style={styles.sectionText}>
              You agree not to use the Service:
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• For any unlawful purpose or activity</Text>
              <Text style={styles.bulletPoint}>• To transmit harmful or malicious code</Text>
              <Text style={styles.bulletPoint}>• To impersonate others or provide false information</Text>
              <Text style={styles.bulletPoint}>• To interfere with the service's operation</Text>
              <Text style={styles.bulletPoint}>• To access unauthorized areas of the system</Text>
            </View>
          </View>

          {/* Demo Services Disclaimer */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Demo Services Disclaimer</Text>
            <Text style={styles.sectionText}>
              All services provided in this application are for demonstration purposes only:
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• No real government services are provided</Text>
              <Text style={styles.bulletPoint}>• No actual documents are processed or issued</Text>
              <Text style={styles.bulletPoint}>• Payment features are simulated only</Text>
              <Text style={styles.bulletPoint}>• Data is not transmitted to government systems</Text>
            </View>
          </View>

          {/* Privacy and Data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Privacy and Data Protection</Text>
            <Text style={styles.sectionText}>
              Your privacy is important to us. Please review our Privacy Policy, which also 
              governs your use of the Service, to understand our practices.
            </Text>
          </View>

          {/* Intellectual Property */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Intellectual Property Rights</Text>
            <Text style={styles.sectionText}>
              The Service and its original content, features, and functionality are and will 
              remain the exclusive property of the demo application creators and its licensors. 
              The Service is protected by copyright, trademark, and other laws.
            </Text>
          </View>

          {/* Termination */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Termination</Text>
            <Text style={styles.sectionText}>
              We may terminate or suspend your account and bar access to the Service immediately, 
              without prior notice or liability, under our sole discretion, for any reason 
              whatsoever including breach of the Terms.
            </Text>
          </View>

          {/* Disclaimer */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Disclaimer</Text>
            <Text style={styles.sectionText}>
              The information on this demo app is provided on an "as is" basis. To the fullest 
              extent permitted by law, this Company:
            </Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Excludes all representations and warranties</Text>
              <Text style={styles.bulletPoint}>• Excludes all liability for damages arising from use</Text>
              <Text style={styles.bulletPoint}>• Makes no guarantees about service availability</Text>
            </View>
          </View>

          {/* Limitation of Liability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              In no event shall the demo app creators, nor its directors, employees, partners, 
              agents, suppliers, or affiliates, be liable for any indirect, incidental, special, 
              consequential, or punitive damages arising from your use of the Service.
            </Text>
          </View>

          {/* Governing Law */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Governing Law</Text>
            <Text style={styles.sectionText}>
              These Terms shall be interpreted and governed by the laws of Nepal, without regard 
              to its conflict of law provisions. Our failure to enforce any right or provision 
              will not be considered a waiver of those rights.
            </Text>
          </View>

          {/* Changes to Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right to modify or replace these Terms at any time. If a revision 
              is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </Text>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>13. Contact Information</Text>
            <Text style={styles.sectionText}>
              If you have any questions about these Terms of Service, please contact us:
            </Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactItem}>📧 legal@nepalcitizenservices.com</Text>
              <Text style={styles.contactItem}>📱 +977-1-XXXXXXX</Text>
              <Text style={styles.contactItem}>📍 Demo Legal Department</Text>
              <Text style={styles.contactItem}>    Kathmandu, Nepal</Text>
            </View>
          </View>

          {/* Acknowledgment */}
          <View style={styles.acknowledgmentSection}>
            <Text style={styles.acknowledgmentTitle}>Acknowledgment</Text>
            <Text style={styles.acknowledgmentText}>
              By using this demo application, you acknowledge that you have read these Terms of 
              Service and agree to be bound by them. This is a demonstration application only 
              and does not provide real government services.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
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
    color: '#dc2626',
    marginBottom: verticalScale(4),
  },
  disclaimerText: {
    fontSize: moderateScale(14),
    color: '#dc2626',
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
    marginBottom: verticalScale(28),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(12),
  },
  sectionText: {
    fontSize: moderateScale(15),
    color: '#374151',
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(12),
  },
  bulletPoints: {
    marginLeft: scale(16),
    marginTop: verticalScale(8),
  },
  bulletPoint: {
    fontSize: moderateScale(14),
    color: '#4b5563',
    lineHeight: moderateScale(20),
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
    fontSize: moderateScale(14),
    color: '#065f46',
    marginBottom: verticalScale(4),
    lineHeight: moderateScale(20),
  },
  acknowledgmentSection: {
    backgroundColor: '#f0fdf4',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: scale(20),
    marginTop: verticalScale(16),
  },
  acknowledgmentTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(12),
  },
  acknowledgmentText: {
    fontSize: moderateScale(15),
    color: '#166534',
    lineHeight: moderateScale(22),
  },
  bottomSpacing: {
    height: verticalScale(32),
  },
});