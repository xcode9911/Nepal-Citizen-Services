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
  const [activeTab, setActiveTab] = useState<'documents' | 'certificate'>('documents');

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

  const handleCertificatePress = (certificate: Certificate) => {
    Alert.alert(
      certificate.title,
      `${certificate.description}\n\nCertificate Number: ${certificate.certificateNumber}\nIssued by: ${certificate.issuer}\nIssue Date: ${certificate.issueDate}\nValid Until: ${certificate.validUntil}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Download Certificate', onPress: () => Alert.alert('Download', 'Certificate download started!') }
      ]
    );
  };

  const documents = [
    {
      id: 1,
      title: 'Citizenship Certificate',
      subtitle: 'Digital Identity Document',
      type: 'Citizen Card',
      status: 'Active',
      issueDate: '2020-05-15',
      expiryDate: 'Lifetime',
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
      issueDate: '2021-03-20',
      expiryDate: 'Lifetime',
      icon: 'document-text',
      color: '#0ea5e9',
      onPress: handlePanCardPress,
    },
  ];

  // Certificate data - Top Tax Payer
  const certificateData: Certificate = {
    id: 'top_tax_payer',
    title: 'Top Tax Payer',
    description: 'Awarded for being among the top 10% of tax payers in Nepal for the fiscal year 2023-24',
    icon: 'trophy',
    issueDate: '2024-01-15',
    validUntil: '2025-01-14',
    certificateNumber: 'NTP-2024-001234',
    issuer: 'Government of Nepal - Ministry of Finance',
    earned: true,
  };

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

          <View style={styles.documentDetails}>
            <View style={styles.documentDetailItem}>
              <Text style={styles.documentDetailLabel}>Issue Date</Text>
              <Text style={styles.documentDetailValue}>{document.issueDate}</Text>
            </View>
            <View style={styles.documentDetailItem}>
              <Text style={styles.documentDetailLabel}>Expiry Date</Text>
              <Text style={styles.documentDetailValue}>{document.expiryDate}</Text>
            </View>
          </View>

          <View style={styles.documentActions}>
            <TouchableOpacity
              style={styles.documentActionButton}
              onPress={() => handleDownloadDocument(document.type)}
            >
              <Ionicons name="download-outline" size={moderateScale(16)} color="#059669" />
              <Text style={styles.documentActionText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.documentActionButton}
              onPress={() => handleShareDocument(document.type)}
            >
              <Ionicons name="share-outline" size={moderateScale(16)} color="#059669" />
              <Text style={styles.documentActionText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.documentActionButton}>
              <Ionicons name="qr-code-outline" size={moderateScale(16)} color="#059669" />
              <Text style={styles.documentActionText}>QR Code</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.addDocumentCard}>
        <View style={styles.addDocumentContent}>
          <View style={styles.addDocumentIcon}>
            <Ionicons name="add" size={moderateScale(32)} color="#6b7280" />
          </View>
          <Text style={styles.addDocumentTitle}>Add New Document</Text>
          <Text style={styles.addDocumentSubtitle}>
            Upload additional documents for verification
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCertificate = () => (
    <View style={styles.certificateContainer}>
      <Text style={styles.certificateHeaderTitle}>Your Certificate</Text>
      <Text style={styles.certificateHeaderSubtitle}>
        Official recognition from Government of Nepal
      </Text>
      
      <TouchableOpacity
        style={styles.certificateCard}
        onPress={() => handleCertificatePress(certificateData)}
      >
        <View style={styles.certificateHeader}>
          <View style={styles.certificateIconContainer}>
            <Ionicons name="ribbon" size={moderateScale(32)} color="#fbbf24" />
          </View>
          <View style={styles.certificateBadge}>
            <Text style={styles.certificateBadgeText}>EARNED</Text>
          </View>
        </View>
        
        <View style={styles.certificateContent}>
          <Text style={styles.certificateTitle}>{certificateData.title}</Text>
          <Text style={styles.certificateDescription}>{certificateData.description}</Text>
          
          <View style={styles.certificateDetails}>
            <View style={styles.certificateDetailRow}>
              <Ionicons name="document-text" size={moderateScale(16)} color="#6b7280" />
              <Text style={styles.certificateDetailText}>
                Certificate No: {certificateData.certificateNumber}
              </Text>
            </View>
            
            <View style={styles.certificateDetailRow}>
              <Ionicons name="calendar" size={moderateScale(16)} color="#6b7280" />
              <Text style={styles.certificateDetailText}>
                Issued: {certificateData.issueDate}
              </Text>
            </View>
            
            <View style={styles.certificateDetailRow}>
              <Ionicons name="time" size={moderateScale(16)} color="#6b7280" />
              <Text style={styles.certificateDetailText}>
                Valid Until: {certificateData.validUntil}
              </Text>
            </View>
            
            <View style={styles.certificateDetailRow}>
              <Ionicons name="business" size={moderateScale(16)} color="#6b7280" />
              <Text style={styles.certificateDetailText}>
                {certificateData.issuer}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.certificateActions}>
          <View style={styles.certificateActionButton}>
            <Ionicons name="download" size={moderateScale(16)} color="#059669" />
            <Text style={styles.certificateActionText}>Download Certificate</Text>
          </View>
          <View style={styles.certificateActionButton}>
            <Ionicons name="share" size={moderateScale(16)} color="#059669" />
            <Text style={styles.certificateActionText}>Share</Text>
          </View>
        </View>
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>My Documents</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'documents' && styles.activeTab]}
          onPress={() => setActiveTab('documents')}
        >
          <Ionicons 
            name="document-text" 
            size={moderateScale(20)} 
            color={activeTab === 'documents' ? '#ffffff' : '#059669'} 
          />
          <Text style={[styles.tabText, activeTab === 'documents' && styles.activeTabText]}>
            Documents
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'certificate' && styles.activeTab]}
          onPress={() => setActiveTab('certificate')}
        >
          <Ionicons 
            name="ribbon" 
            size={moderateScale(20)} 
            color={activeTab === 'certificate' ? '#ffffff' : '#059669'} 
          />
          <Text style={[styles.tabText, activeTab === 'certificate' && styles.activeTabText]}>
            Certificate
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'documents' ? renderDocuments() : renderCertificate()}
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