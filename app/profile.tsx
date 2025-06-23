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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export default function ProfilePage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleDocuments = () => {
    router.push('/documents');
  };

  const handlePaymentHistory = () => {
    router.push('/paymenthistory');
  };

  const handleSupport = () => {
    router.push('/support');
  };

  const handlePrivacyPolicy = () => {
    router.push('/privacypolicy');
  };

  const handleTermsOfService = () => {
    router.push('/terms');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
          },
        },
      ]
    );
  };

  const profileStats = [
    { label: 'Documents', value: '8', icon: 'document-text' },
    { label: 'Payments', value: '45', icon: 'card' },
  ];

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: 'document-text-outline', title: 'My Documents', onPress: handleDocuments },
        { icon: 'card-outline', title: 'Payments', onPress: handlePaymentHistory },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: 'notifications-outline', 
          title: 'Push Notifications', 
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
        },
        { 
          icon: 'finger-print-outline', 
          title: 'Biometric Login', 
          hasSwitch: true,
          switchValue: biometricEnabled,
          onSwitchChange: setBiometricEnabled,
        },
        { 
          icon: 'moon-outline', 
          title: 'Dark Mode', 
          hasSwitch: true,
          switchValue: darkModeEnabled,
          onSwitchChange: setDarkModeEnabled,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', title: 'Help & Support', onPress: handleSupport },
        { icon: 'shield-checkmark-outline', title: 'Privacy Policy', onPress: handlePrivacyPolicy },
        { icon: 'document-outline', title: 'Terms of Service', onPress: handleTermsOfService },
      ],
    },
  ];

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
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={require('../assets/images/Logo.png')} 
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={moderateScale(16)} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@email.com</Text>
            <Text style={styles.profileId}>ID: NP-123456789</Text>
            <View style={styles.verificationBadge}>
              <Ionicons name="checkmark-circle" size={moderateScale(16)} color="#10b981" />
              <Text style={styles.verificationText}>Verified Citizen</Text>
            </View>
          </View>
        </View>

        {/* Profile Stats */}
        <View style={styles.statsSection}>
          {profileStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name={stat.icon as any} size={moderateScale(20)} color="#059669" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuItems}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex === section.items.length - 1 && styles.lastMenuItem,
                  ]}
                  onPress={item.onPress}
                  disabled={item.hasSwitch}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIconContainer}>
                      <Ionicons name={item.icon as any} size={moderateScale(20)} color="#059669" />
                    </View>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                  </View>
                  
                  {item.hasSwitch ? (
                    <Switch
                      value={item.switchValue}
                      onValueChange={item.onSwitchChange}
                      trackColor={{ false: '#e5e7eb', true: '#a7f3d0' }}
                      thumbColor={item.switchValue ? '#059669' : '#f3f4f6'}
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={moderateScale(16)} color="#6b7280" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, styles.logoutIconContainer]}>
                  <Ionicons name="log-out-outline" size={moderateScale(20)} color="#ef4444" />
                </View>
                <Text style={[styles.menuItemTitle, styles.logoutText]}>Logout</Text>
              </View>
              <Ionicons name="chevron-forward" size={moderateScale(16)} color="#6b7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.lastMenuItem]} 
              onPress={handleDeleteAccount}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, styles.deleteIconContainer]}>
                  <Ionicons name="trash-outline" size={moderateScale(20)} color="#dc2626" />
                </View>
                <Text style={[styles.menuItemTitle, styles.deleteText]}>Delete Account</Text>
              </View>
              <Ionicons name="chevron-forward" size={moderateScale(16)} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Nepal Citizen Services</Text>
          <Text style={styles.versionNumber}>Version 1.0.0</Text>
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
    width: scale(40), // Fixed width for consistent spacing
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#065f46',
    textAlign: 'center',
  },
  headerSpacer: {
    width: scale(40), // Same width as back button to balance the layout
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: verticalScale(32),
    paddingHorizontal: scale(24),
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: verticalScale(16),
  },
  profileImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: 4,
    borderColor: '#a7f3d0',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: moderateScale(24),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(4),
  },
  profileEmail: {
    fontSize: moderateScale(16),
    color: '#6b7280',
    marginBottom: verticalScale(4),
  },
  profileId: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    marginBottom: verticalScale(8),
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    gap: scale(4),
  },
  verificationText: {
    fontSize: moderateScale(12),
    color: '#059669',
    fontWeight: '500',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: verticalScale(24),
    marginHorizontal: scale(24),
    backgroundColor: '#f8fffe',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: verticalScale(24),
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  statValue: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#059669',
    marginBottom: verticalScale(2),
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    textAlign: 'center',
  },
  menuSection: {
    marginHorizontal: scale(24),
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(12),
  },
  menuItems: {
    backgroundColor: '#f8fffe',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  menuItemTitle: {
    fontSize: moderateScale(16),
    color: '#065f46',
    fontWeight: '500',
  },
  dangerSection: {
    marginHorizontal: scale(24),
    marginBottom: verticalScale(24),
  },
  logoutIconContainer: {
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    color: '#ef4444',
  },
  deleteIconContainer: {
    backgroundColor: '#fef2f2',
  },
  deleteText: {
    color: '#dc2626',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: verticalScale(24),
    marginHorizontal: scale(24),
  },
  versionText: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    marginBottom: verticalScale(4),
  },
  versionNumber: {
    fontSize: moderateScale(12),
    color: '#9ca3af',
  },
  bottomSpacing: {
    height: verticalScale(20),
  },
});