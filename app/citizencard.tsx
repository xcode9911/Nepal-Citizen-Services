import { router } from 'expo-router';
import React, { useState } from 'react';
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
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export default function CitizenCardPage() {
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleDownloadCard = () => {
    Alert.alert(
      'Download Citizen Card',
      'Download digital citizen card as PDF?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => Alert.alert('Success', 'Citizen card downloaded successfully!') },
      ]
    );
  };

  const handleShareCard = () => {
    Alert.alert(
      'Share Citizen Card',
      'Share your digital citizen card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => Alert.alert('Shared', 'Citizen card shared successfully!') },
      ]
    );
  };

  const handleVerifyCard = () => {
    Alert.alert('Verification', 'This is a demo citizen card. In a real app, this would verify with government databases.');
  };

  const handleFlipCard = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  // Mock Citizen card data
  const citizenCardData = {
    fullName: 'JOHN DOE',
    fatherName: 'ROBERT DOE',
    motherName: 'MARY DOE',
    dateOfBirth: '15/08/1990',
    citizenNumber: 'NP-123456789',
    nationality: 'NEPALI',
    sex: 'MALE',
    permanentAddress: 'Ward No. 5, Kathmandu Metropolitan City, Bagmati Province, Nepal',
    issueDate: '25/12/2023',
    issuePlace: 'District Administration Office, Kathmandu',
    signature: 'John Doe',
  };

  const ThumbprintComponent = ({ label }: { label: string }) => (
    <View style={styles.thumbprintContainer}>
      <Text style={styles.thumbprintLabel}>{label}</Text>
      <View style={styles.thumbprintBox}>
        <View style={styles.thumbprintPattern}>
          {/* Creating a simple thumbprint pattern */}
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={[styles.thumbprintLine, { 
              transform: [{ rotate: `${i * 22.5}deg` }],
              opacity: 0.6 - (i * 0.05)
            }]} />
          ))}
          <View style={styles.thumbprintCenter} />
        </View>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Citizen Card</Text>
        <TouchableOpacity style={styles.moreButton} onPress={handleVerifyCard}>
          <Ionicons name="shield-checkmark" size={moderateScale(24)} color="#059669" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={moderateScale(16)} color="#10b981" />
            <Text style={styles.statusText}>Verified & Active</Text>
          </View>
        </View>

        {/* Digital Citizen Card */}
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.cardWrapper} 
            onPress={handleFlipCard}
            activeOpacity={0.9}
          >
            {!isCardFlipped ? (
              // Front of the card
              <View style={styles.citizenCard}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <Image 
                    source={require('../assets/images/Logo.png')} 
                    style={styles.cardLogo}
                  />
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>NEPAL CITIZEN SERVICES</Text>
                    <Text style={styles.cardSubtitle}>CITIZENSHIP CERTIFICATE</Text>
                  </View>
                  <View style={styles.nepalFlag}>
                    <Text style={styles.flagText}>🇳🇵</Text>
                  </View>
                </View>

                {/* Card Body */}
                <View style={styles.cardBody}>
                  <View style={styles.cardContent}>
                    {/* Photo and Basic Info */}
                    <View style={styles.photoSection}>
                      <View style={styles.photoContainer}>
                        <Image 
                          source={require('../assets/images/Logo.png')} 
                          style={styles.cardPhoto}
                        />
                      </View>
                      <View style={styles.basicInfo}>
                        <Text style={styles.nameText}>{citizenCardData.fullName}</Text>
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Father:</Text>
                          <Text style={styles.infoValue}>{citizenCardData.fatherName}</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Mother:</Text>
                          <Text style={styles.infoValue}>{citizenCardData.motherName}</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>DOB:</Text>
                          <Text style={styles.infoValue}>{citizenCardData.dateOfBirth}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Citizen Number */}
                    <View style={styles.citizenNumberSection}>
                      <Text style={styles.citizenNumberLabel}>CITIZENSHIP NO.</Text>
                      <Text style={styles.citizenNumberText}>{citizenCardData.citizenNumber}</Text>
                    </View>

                    {/* Personal Details */}
                    <View style={styles.personalDetails}>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Nationality:</Text>
                          <Text style={styles.detailValue}>{citizenCardData.nationality}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Sex:</Text>
                          <Text style={styles.detailValue}>{citizenCardData.sex}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Address */}
                    <View style={styles.addressSection}>
                      <Text style={styles.addressLabel}>Permanent Address:</Text>
                      <Text style={styles.addressText}>{citizenCardData.permanentAddress}</Text>
                    </View>
                  </View>
                </View>

                {/* Card Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.footerLeft}>
                    <Text style={styles.footerLabel}>Issue Date:</Text>
                    <Text style={styles.footerValue}>{citizenCardData.issueDate}</Text>
                  </View>
                  <View style={styles.footerRight}>
                    <Text style={styles.footerLabel}>Issue Place:</Text>
                    <Text style={styles.footerValue}>{citizenCardData.issuePlace}</Text>
                  </View>
                </View>

                {/* Tap to flip indicator */}
                <View style={styles.flipIndicator}>
                  <Ionicons name="refresh" size={moderateScale(16)} color="#6b7280" />
                  <Text style={styles.flipText}>Tap to flip</Text>
                </View>
              </View>
            ) : (
              // Back of the card
              <View style={styles.citizenCardBack}>
                <View style={styles.backHeader}>
                  <Text style={styles.backTitle}>BIOMETRIC DATA & INFORMATION</Text>
                </View>
                
                <View style={styles.backContent}>
                  {/* Thumbprints Section */}
                  <View style={styles.thumbprintsSection}>
                    <Text style={styles.thumbprintsTitle}>Thumbprints:</Text>
                    <View style={styles.thumbprintsContainer}>
                      <ThumbprintComponent label="Right Thumb" />
                      <ThumbprintComponent label="Left Thumb" />
                    </View>
                  </View>

                  {/* Signature Section */}
                  <View style={styles.signatureSection}>
                    <Text style={styles.signatureLabel}>Signature:</Text>
                    <View style={styles.signatureBox}>
                      <Text style={styles.signatureText}>{citizenCardData.signature}</Text>
                    </View>
                  </View>

                  <View style={styles.instructionsSection}>
                    <Text style={styles.instructionsTitle}>Important Notes:</Text>
                    <Text style={styles.instructionText}>• This card is property of Government of Nepal</Text>
                    <Text style={styles.instructionText}>• Report loss/theft to nearest police station</Text>
                    <Text style={styles.instructionText}>• Valid for all official identification purposes</Text>
                    <Text style={styles.instructionText}>• Keep this card safe and secure</Text>
                    <Text style={styles.instructionText}>• Renewal required every 10 years</Text>
                  </View>

                  <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>For Support:</Text>
                    <Text style={styles.contactText}>📞 Helpline: 1180</Text>
                    <Text style={styles.contactText}>🌐 www.dofe.gov.np</Text>
                    <Text style={styles.contactText}>📧 info@dofe.gov.np</Text>
                  </View>
                </View>

                <View style={styles.backFooter}>
                  <Text style={styles.demoNotice}>Demo Card - For Demonstration Only</Text>
                </View>

                {/* Tap to flip indicator */}
                <View style={styles.flipIndicator}>
                  <Ionicons name="refresh" size={moderateScale(16)} color="#6b7280" />
                  <Text style={styles.flipText}>Tap to flip</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownloadCard}>
            <Ionicons name="download-outline" size={moderateScale(20)} color="#059669" />
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShareCard}>
            <Ionicons name="share-outline" size={moderateScale(20)} color="#059669" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleVerifyCard}>
            <Ionicons name="shield-checkmark-outline" size={moderateScale(20)} color="#059669" />
            <Text style={styles.actionButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>

        {/* Card Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>About Your Citizenship Certificate</Text>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={moderateScale(16)} color="#059669" />
            <Text style={styles.infoItemText}>
              Your citizenship certificate is the primary proof of your Nepali citizenship.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={moderateScale(16)} color="#059669" />
            <Text style={styles.infoItemText}>
              This digital version contains biometric data and is legally valid.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="warning" size={moderateScale(16)} color="#f59e0b" />
            <Text style={styles.infoItemText}>
              This is a demo card for demonstration purposes only.
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
  moreButton: {
    padding: scale(8),
    width: scale(40),
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(16),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    gap: scale(6),
  },
  statusText: {
    fontSize: moderateScale(14),
    color: '#059669',
    fontWeight: '600',
  },
  cardContainer: {
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(16),
  },
  cardWrapper: {
    borderRadius: moderateScale(16),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  citizenCard: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderColor: '#059669',
    overflow: 'hidden',
    minHeight: verticalScale(320),
  },
  citizenCardBack: {
    backgroundColor: '#f8fffe',
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderColor: '#059669',
    overflow: 'hidden',
    minHeight: verticalScale(320),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  cardLogo: {
    width: scale(32),
    height: scale(32),
    marginRight: scale(12),
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#ffffff',
  },
  cardSubtitle: {
    fontSize: moderateScale(10),
    color: '#a7f3d0',
    marginTop: verticalScale(2),
  },
  nepalFlag: {
    marginLeft: scale(8),
  },
  flagText: {
    fontSize: moderateScale(24),
  },
  cardBody: {
    flex: 1,
    padding: scale(16),
  },
  cardContent: {
    flex: 1,
  },
  photoSection: {
    flexDirection: 'row',
    marginBottom: verticalScale(16),
  },
  photoContainer: {
    width: scale(80),
    height: scale(100),
    backgroundColor: '#f3f4f6',
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  cardPhoto: {
    width: scale(60),
    height: scale(60),
    borderRadius: moderateScale(4),
  },
  basicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#065f46',
    marginBottom: verticalScale(8),
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: verticalScale(4),
  },
  infoLabel: {
    fontSize: moderateScale(11),
    color: '#6b7280',
    width: scale(50),
  },
  infoValue: {
    fontSize: moderateScale(11),
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  citizenNumberSection: {
    alignItems: 'center',
    marginBottom: verticalScale(16),
    backgroundColor: '#f0fdf4',
    padding: scale(12),
    borderRadius: moderateScale(8),
  },
  citizenNumberLabel: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    marginBottom: verticalScale(4),
  },
  citizenNumberText: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#059669',
    letterSpacing: 1,
  },
  personalDetails: {
    marginBottom: verticalScale(12),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    marginRight: scale(16),
  },
  detailLabel: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    width: scale(70),
  },
  detailValue: {
    fontSize: moderateScale(12),
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  addressSection: {
    marginBottom: verticalScale(12),
  },
  addressLabel: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    marginBottom: verticalScale(4),
  },
  addressText: {
    fontSize: moderateScale(12),
    color: '#374151',
    lineHeight: moderateScale(16),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footerLabel: {
    fontSize: moderateScale(10),
    color: '#6b7280',
  },
  footerValue: {
    fontSize: moderateScale(10),
    color: '#374151',
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  flipIndicator: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    gap: scale(4),
  },
  flipText: {
    fontSize: moderateScale(10),
    color: '#6b7280',
  },
  // Back of card styles
  backHeader: {
    backgroundColor: '#059669',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
  },
  backTitle: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#ffffff',
  },
  backContent: {
    flex: 1,
    padding: scale(16),
  },
  // Thumbprints styles
  thumbprintsSection: {
    marginBottom: verticalScale(16),
  },
  thumbprintsTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(8),
  },
  thumbprintsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  thumbprintContainer: {
    alignItems: 'center',
  },
  thumbprintLabel: {
    fontSize: moderateScale(10),
    color: '#6b7280',
    marginBottom: verticalScale(4),
  },
  thumbprintBox: {
    width: scale(60),
    height: scale(70),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: moderateScale(4),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbprintPattern: {
    width: scale(50),
    height: scale(60),
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbprintLine: {
    position: 'absolute',
    width: scale(40),
    height: 1,
    backgroundColor: '#374151',
    borderRadius: 1,
  },
  thumbprintCenter: {
    width: scale(8),
    height: scale(8),
    backgroundColor: '#374151',
    borderRadius: scale(4),
  },
  signatureSection: {
    marginBottom: verticalScale(16),
  },
  signatureLabel: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    marginBottom: verticalScale(8),
  },
  signatureBox: {
    height: verticalScale(40),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: moderateScale(4),
    justifyContent: 'center',
    paddingHorizontal: scale(12),
  },
  signatureText: {
    fontSize: moderateScale(16),
    color: '#374151',
    fontStyle: 'italic',
  },
  instructionsSection: {
    marginBottom: verticalScale(16),
  },
  instructionsTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(8),
  },
  instructionText: {
    fontSize: moderateScale(11),
    color: '#374151',
    marginBottom: verticalScale(4),
    lineHeight: moderateScale(15),
  },
  contactSection: {
    marginBottom: verticalScale(16),
  },
  contactTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(8),
  },
  contactText: {
    fontSize: moderateScale(11),
    color: '#374151',
    marginBottom: verticalScale(4),
  },
  backFooter: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    alignItems: 'center',
  },
  demoNotice: {
    fontSize: moderateScale(10),
    color: '#92400e',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(20),
    gap: scale(12),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: scale(6),
  },
  actionButtonText: {
    fontSize: moderateScale(14),
    color: '#059669',
    fontWeight: '600',
  },
  infoContainer: {
    marginHorizontal: scale(24),
    backgroundColor: '#f8fffe',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: scale(16),
  },
  infoTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(12),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(12),
    gap: scale(8),
  },
  infoItemText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#374151',
    lineHeight: moderateScale(20),
  },
  bottomSpacing: {
    height: verticalScale(32),
  },
});