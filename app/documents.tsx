import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

interface Certificate {
  id: string;
  title: string;
  description: string;
  icon: string;
  issueDate: string;
  validUntil: string;
  certificateNumber: string;
  issuer: string;
  earned: boolean;
}

export default function DocumentsPage() {
  // Remove activeTab and all certificate logic

  const handleGoBack = () => {
    router.back();
  };

  const handleCitizenCardPress = () => {
    router.push('/citizencard');
  };

  const handlePanCardPress = () => {
    router.push('/pancard');
  };

  const handleDownloadDocument = (documentType: string) => {
    Alert.alert(
      'Download Document',
      `Download ${documentType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => Alert.alert('Success', `${documentType} downloaded successfully!`) },
      ]
    );
  };

  const handleShareDocument = (documentType: string) => {
    Alert.alert(
      'Share Document',
      `Share ${documentType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => Alert.alert('Success', `${documentType} shared successfully!`) },
      ]
    );
  };

  // Remove handleCertificatePress and certificateData

  const documents = [
    {
      id: 1,
      title: 'Citizenship Certificate',
      subtitle: 'Digital Identity Document',
      type: 'Citizen Card',
      status: 'Active',
      icon: 'card',
      color: '#059669',
      onPress: handleCitizenCardPress,
    },
    {
      id: 2,
      title: 'PAN Card',
      subtitle: 'Tax Identification Number',
      type: 'PAN Card',
      status: 'Active',
      icon: 'document-text',
      color: '#0ea5e9',
      onPress: handlePanCardPress,
    },
  ];

  const renderDocuments = () => (
    <View style={styles.documentsContainer}>
      {documents.map((document) => (
        <TouchableOpacity
          key={document.id}
          style={styles.documentCard}
          onPress={document.onPress}
        >
          <View style={styles.documentHeader}>
            <View style={[styles.documentIconContainer, { backgroundColor: `${document.color}15` }]}>
              <Ionicons name={document.icon as any} size={moderateScale(28)} color={document.color} />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>{document.title}</Text>
              <Text style={styles.documentSubtitle}>{document.subtitle}</Text>
              <View style={styles.documentStatus}>
                <View style={[styles.statusDot, { backgroundColor: document.color }]} />
                <Text style={[styles.statusText, { color: document.color }]}>{document.status}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={moderateScale(20)} color="#6b7280" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Remove renderCertificate and all certificate UI

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#059669" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* Only render documents, no tab switcher or certificates */}
      {renderDocuments()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
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
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#065f46',
  },
  headerSpacer: {
    width: scale(40),
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: scale(24),
    marginTop: verticalScale(20),
    backgroundColor: '#f3f4f6',
    borderRadius: moderateScale(12),
    padding: scale(4),
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    gap: scale(8),
  },
  activeTab: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#059669',
  },
  activeTabText: {
    color: '#ffffff',
  },
  // Documents Styles
  documentsContainer: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
  },
  documentCard: {
    backgroundColor: '#f8fffe',
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: scale(20),
    marginBottom: verticalScale(16),
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  documentIconContainer: {
    width: scale(60),
    height: scale(60),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(4),
  },
  documentSubtitle: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    marginBottom: verticalScale(6),
  },
  documentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginRight: scale(6),
  },
  statusText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  documentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  documentDetailItem: {
    flex: 1,
  },
  documentDetailLabel: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    marginBottom: verticalScale(4),
  },
  documentDetailValue: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#065f46',
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  documentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    gap: scale(4),
  },
  documentActionText: {
    fontSize: moderateScale(12),
    color: '#059669',
    fontWeight: '500',
  },
  addDocumentCard: {
    backgroundColor: '#f9fafb',
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    padding: scale(32),
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  addDocumentContent: {
    alignItems: 'center',
  },
  addDocumentIcon: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  addDocumentTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#374151',
    marginBottom: verticalScale(8),
  },
  addDocumentSubtitle: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    textAlign: 'center',
  },
  // Certificate Styles
  certificateContainer: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
  },
  certificateHeaderTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(8),
  },
  certificateHeaderSubtitle: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    marginBottom: verticalScale(20),
  },
  certificateCard: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderColor: '#fbbf24',
    padding: scale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  certificateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  certificateIconContainer: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  certificateBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
  },
  certificateBadgeText: {
    fontSize: moderateScale(12),
    color: '#ffffff',
    fontWeight: '700',
  },
  certificateContent: {
    marginBottom: verticalScale(20),
  },
  certificateTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#065f46',
    marginBottom: verticalScale(8),
  },
  certificateDescription: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  certificateDetails: {
    gap: verticalScale(8),
  },
  certificateDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  certificateDetailText: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    flex: 1,
  },
  certificateActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: verticalScale(16),
  },
  certificateActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  certificateActionText: {
    fontSize: moderateScale(14),
    color: '#059669',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: verticalScale(20),
  },
});