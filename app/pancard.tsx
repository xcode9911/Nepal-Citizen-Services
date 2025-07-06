import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type TokenPayload = {
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  citizenshipNo: string;
  address: string;
  issueDate: string;
};

export default function PANCardPage() {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [panCardData, setPanCardData] = useState<{
    fullName: string;
    dateOfBirth: string;
    panNumber: string;
    address: string;
    citizenNumber: string;
    issueDate: string;
    issuePlace: string;
    signature: string;
  } | null>(null);
  const viewShotRef = useRef<ViewShot>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        console.log('Token loaded for PAN:', token ? 'Token exists' : 'No token found');
        
        if (!token) {
          console.log('No token found in AsyncStorage for PAN');
          return;
        }
        
        const decoded: TokenPayload = jwtDecode(token);
        console.log('Token decoded successfully for PAN:', decoded);
        
        // Format dates to DD/MM/YYYY
        const formatDate = (dateString: string) => {
          try {
            const date = new Date(dateString);
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
          } catch (error) {
            console.error('Date formatting error:', error);
            return dateString; // Return original if parsing fails
          }
        };
        
        // Generate PAN number from citizenship number
        const generatePAN = (citizenshipNo: string) => {
          const name = decoded.name || 'DEMO';
          const firstLetters = name.substring(0, 5).toUpperCase().padEnd(5, 'A');
          const numbers = citizenshipNo.replace(/\D/g, '').substring(0, 4).padEnd(4, '0');
          const lastLetter = name.charAt(name.length - 1).toUpperCase() || 'A';
          return `${firstLetters}${numbers}${lastLetter}`;
        };
        
        setPanCardData({
          fullName: decoded.name?.toUpperCase() || 'N/A',
          dateOfBirth: formatDate(decoded.dob || ''),
          panNumber: generatePAN(decoded.citizenshipNo || ''),
          address: decoded.address || 'N/A',
          citizenNumber: decoded.citizenshipNo || 'N/A',
          issueDate: formatDate(decoded.issueDate || ''),
          issuePlace: 'Inland Revenue Department, Kathmandu',
          signature: decoded.name || 'N/A',
        });
      } catch (error) {
        console.error('Failed to load or decode token for PAN:', error);
        // Set default data if token loading fails
        setPanCardData({
          fullName: 'DEMO USER',
          dateOfBirth: '01/01/1990',
          panNumber: 'DEMOU1234A',
          address: 'Ward No. 5, Kathmandu Metropolitan City, Bagmati Province, Nepal',
          citizenNumber: 'DEMO-123456',
          issueDate: '01/01/2020',
          issuePlace: 'Inland Revenue Department, Kathmandu',
          signature: 'DEMO USER',
        });
      }
    };
    
    loadToken();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleDownloadCard = async () => {
    if (!viewShotRef.current?.capture) return;

    try {
      const uri = await viewShotRef.current.capture();
      
      // Request permission to save to media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to save to gallery is required.');
        return;
      }
      
      // Save to media library
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert(
        'Success', 
        'PAN card saved to your gallery!\n\nNote: This is a demo card for demonstration purposes only.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download the card. Please try again.');
    }
  };

  const handleShareCard = async () => {
    if (!viewShotRef.current?.capture) return;

    try {
      const uri = await viewShotRef.current.capture();
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share PAN Card',
          UTI: 'public.png'
        });
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share the card. Please try again.');
    }
  };

  const handleVerifyCard = () => {
    Alert.alert('Verification', 'This is a demo PAN card. In a real app, this would verify with government databases.');
  };

  const handleFlipCard = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  if (!panCardData) {
    return (
      <View style={styles.container}>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
          translucent={false}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading your PAN data...</Text>
        </View>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>PAN Card</Text>
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

        {/* Digital PAN Card */}
        <View style={styles.cardContainer}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
            <TouchableOpacity 
              style={styles.cardWrapper} 
              onPress={handleFlipCard}
              activeOpacity={0.9}
            >
            {!isCardFlipped ? (
              // Front of the card
              <View style={styles.panCard}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <Image 
                    source={require('../assets/images/Logo.png')} 
                    style={styles.cardLogo}
                  />
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>NEPAL CITIZEN SERVICES</Text>
                    <Text style={styles.cardSubtitle}>PERMANENT ACCOUNT NUMBER</Text>
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
                        <Text style={styles.nameText}>{panCardData.fullName}</Text>
                        <Text style={styles.dobText}>DOB: {panCardData.dateOfBirth}</Text>
                      </View>
                    </View>

                    {/* PAN Number */}
                    <View style={styles.panNumberSection}>
                      <Text style={styles.panNumberLabel}>PAN</Text>
                      <Text style={styles.panNumberText}>{panCardData.panNumber}</Text>
                    </View>

                    {/* Address */}
                    <View style={styles.addressSection}>
                      <Text style={styles.addressLabel}>Address:</Text>
                      <Text style={styles.addressText}>{panCardData.address}</Text>
                    </View>

                    {/* Additional Info */}
                    <View style={styles.additionalInfo}>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Citizen No:</Text>
                        <Text style={styles.infoValue}>{panCardData.citizenNumber}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Card Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.footerLeft}>
                    <Text style={styles.footerLabel}>Issue Date:</Text>
                    <Text style={styles.footerValue}>{panCardData.issueDate}</Text>
                  </View>
                  <View style={styles.footerRight}>
                    <Text style={styles.footerLabel}>Issue Place:</Text>
                    <Text style={styles.footerValue}>{panCardData.issuePlace}</Text>
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
              <View style={styles.panCardBack}>
                <View style={styles.backHeader}>
                  <Text style={styles.backTitle}>IMPORTANT INFORMATION</Text>
                </View>
                
                <View style={styles.backContent}>
                  <View style={styles.signatureSection}>
                    <Text style={styles.signatureLabel}>Signature:</Text>
                    <View style={styles.signatureBox}>
                      <Text style={styles.signatureText}>{panCardData.signature}</Text>
                    </View>
                  </View>

                  <View style={styles.instructionsSection}>
                    <Text style={styles.instructionsTitle}>Instructions:</Text>
                    <Text style={styles.instructionText}>• This card is property of Government of Nepal</Text>
                    <Text style={styles.instructionText}>• Report loss/theft immediately</Text>
                    <Text style={styles.instructionText}>• Valid for all financial transactions</Text>
                    <Text style={styles.instructionText}>• Keep this card safe and secure</Text>
                  </View>

                  <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>For Support:</Text>
                    <Text style={styles.contactText}>📞 Helpline: 1180</Text>
                    <Text style={styles.contactText}>🌐 www.ird.gov.np</Text>
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
          </ViewShot>
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
          <Text style={styles.infoTitle}>About Your PAN Card</Text>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={moderateScale(16)} color="#059669" />
            <Text style={styles.infoItemText}>
              Your PAN card is a unique identification for all financial transactions in Nepal.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={moderateScale(16)} color="#059669" />
            <Text style={styles.infoItemText}>
              This digital version is as valid as the physical card for most purposes.
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
  panCard: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderColor: '#059669',
    overflow: 'hidden',
    minHeight: verticalScale(280),
  },
  panCardBack: {
    backgroundColor: '#f8fffe',
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderColor: '#059669',
    overflow: 'hidden',
    minHeight: verticalScale(280),
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
    marginBottom: verticalScale(4),
  },
  fatherNameText: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    marginBottom: verticalScale(4),
  },
  dobText: {
    fontSize: moderateScale(12),
    color: '#6b7280',
  },
  panNumberSection: {
    alignItems: 'center',
    marginBottom: verticalScale(16),
    backgroundColor: '#f0fdf4',
    padding: scale(12),
    borderRadius: moderateScale(8),
  },
  panNumberLabel: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    marginBottom: verticalScale(4),
  },
  panNumberText: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#059669',
    letterSpacing: 2,
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
  additionalInfo: {
    marginBottom: verticalScale(8),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(4),
  },
  infoLabel: {
    fontSize: moderateScale(12),
    color: '#6b7280',
  },
  infoValue: {
    fontSize: moderateScale(12),
    color: '#374151',
    fontWeight: '500',
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
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#ffffff',
  },
  backContent: {
    flex: 1,
    padding: scale(16),
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
    fontSize: moderateScale(12),
    color: '#374151',
    marginBottom: verticalScale(4),
    lineHeight: moderateScale(16),
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
    fontSize: moderateScale(12),
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