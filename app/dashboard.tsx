import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
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

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

interface UserData {
  name: string;
  citizenshipNo: string;
}

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token) as any;
        setUserData({
          name: decoded.name || 'User',
          citizenshipNo: decoded.citizenshipNo || 'N/A',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleNotificationsPress = () => {
    router.push('/notification');
  };

  const handleQRPress = () => {
    router.push('/qrcode');
  };

  const handleSupportPress = () => {
    router.push('/support');
  };

  const handleCitizenCardPress = () => {
    router.push('/citizencard');
  };

  const handlePanCardPress = () => {
    router.push('/pancard');
  };

  // New handlers for payment navigation
  const handleRecentPaymentsPress = () => {
    router.push('/paymenthistory');
  };

  const handelLeaderboardPress = () => {
    router.push('/leaderboard');
  };

  const handleQuickAnalyticsPress = () => {
    router.push('/paymenthistory');
  };

  // Mock data
  const recentPayments = [
    { service: 'Vehicle Registration', amount: 'Rs. 2,500', date: '2024-01-15', status: 'Completed' },
    { service: 'Citizenship Renewal', amount: 'Rs. 1,200', date: '2024-01-12', status: 'Pending' },
    { service: 'License Fee', amount: 'Rs. 800', date: '2024-01-10', status: 'Completed' },
  ];

  const leaderboardData = [
    { rank: 1, name: 'Ram Sharma', points: 2450 },
    { rank: 2, name: 'Sita Poudel', points: 2380 },
    { rank: 3, name: 'Hari Thapa', points: 2250 },
  ];

  const myCards = [
    { 
      title: 'Citizen Card', 
      subtitle: 'Digital Citizenship ID', 
      icon: 'card', 
      status: 'Active',
      onPress: handleCitizenCardPress 
    },
    { 
      title: 'PAN Card', 
      subtitle: 'Tax Identification', 
      icon: 'document-text', 
      status: 'Active',
      onPress: handlePanCardPress 
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
        translucent={false}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userData?.name || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationsPress}>
            <Ionicons name="notifications" size={moderateScale(24)} color="#059669" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <TouchableOpacity style={styles.profileCard} onPress={handleProfilePress}>
          <View style={styles.profileInfo}>
            <Image 
              source={require('../assets/images/Logo.png')} 
              style={styles.profileImage}
            />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{userData?.name || 'User'}</Text>
              <Text style={styles.profileId}>ID: {userData?.citizenshipNo || 'N/A'}</Text>
              <Text style={styles.profileStatus}>✓ Verified Citizen</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={moderateScale(20)} color="#6b7280" />
        </TouchableOpacity>

        {/* QR Code */}
        <TouchableOpacity style={styles.qrCard} onPress={handleQRPress}>
          <View style={styles.qrContent}>
            <View style={styles.qrCodePlaceholder}>
              <Ionicons name="qr-code" size={moderateScale(40)} color="#059669" />
            </View>
            <View style={styles.qrInfo}>
              <Text style={styles.qrTitle}>Your Digital ID</Text>
              <Text style={styles.qrSubtitle}>Tap to view QR code</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* My Cards */}
        <View style={styles.cardsContainer}>
          <Text style={styles.sectionTitle}>My Cards</Text>
          <View style={styles.cardsGrid}>
            {myCards.map((card, index) => (
              <TouchableOpacity key={index} style={styles.cardItem} onPress={card.onPress}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name={card.icon as any} size={moderateScale(32)} color="#059669" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  <View style={styles.cardStatusContainer}>
                    <View style={styles.cardStatusDot} />
                    <Text style={styles.cardStatus}>{card.status}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={moderateScale(20)} color="#6b7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Payments - Now Clickable */}
        <TouchableOpacity style={styles.paymentsCard} onPress={handleRecentPaymentsPress}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Payments</Text>
            <Ionicons name="chevron-forward" size={moderateScale(20)} color="#6b7280" />
          </View>
          {recentPayments.map((payment, index) => (
            <View key={index} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentService}>{payment.service}</Text>
                <Text style={styles.paymentDate}>{payment.date}</Text>
              </View>
              <View style={styles.paymentRight}>
                <Text style={styles.paymentAmount}>{payment.amount}</Text>
                <View style={[
                  styles.paymentStatus,
                  payment.status === 'Completed' ? styles.statusCompleted : styles.statusPending
                ]}>
                  <Text style={[
                    styles.statusText,
                    payment.status === 'Completed' ? styles.statusTextCompleted : styles.statusTextPending
                  ]}>
                    {payment.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          <View style={styles.viewAllContainer}>
            <Text style={styles.viewAllText}>Tap to view all payments</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Analytics - Now Clickable */}
        <TouchableOpacity style={styles.analyticsCard} onPress={handleQuickAnalyticsPress}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Analytics</Text>
            <Ionicons name="chevron-forward" size={moderateScale(20)} color="#6b7280" />
          </View>
          <View style={styles.analyticsContent}>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>This Month</Text>
              <Text style={styles.analyticsValue}>Rs. 4,500</Text>
              <Text style={styles.analyticsChange}>+12% from last month</Text>
            </View>
            <View style={styles.analyticsChart}>
              <View style={styles.chartBar} />
              <View style={[styles.chartBar, { height: '60%' }]} />
              <View style={[styles.chartBar, { height: '80%' }]} />
              <View style={[styles.chartBar, { height: '40%' }]} />
              <View style={styles.chartBar} />
            </View>
          </View>
          <View style={styles.viewAllContainer}>
            <Text style={styles.viewAllText}>Tap to view detailed analytics</Text>
          </View>
        </TouchableOpacity>

        {/* Leaderboard Snapshot */}
        <TouchableOpacity onPress={handelLeaderboardPress}>
        <View style={styles.leaderboardCard}>
          <Text style={styles.sectionTitle}>Community Leaderboard</Text>
          {leaderboardData.map((user, index) => (
            <View key={index} style={styles.leaderboardItem}>
              <View style={styles.leaderboardLeft}>
                <Text style={styles.leaderboardRank}>#{user.rank}</Text>
                <Text style={styles.leaderboardName}>{user.name}</Text>
              </View>
              <Text style={styles.leaderboardPoints}>{user.points} pts</Text>
            </View>
          ))}
        </View>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Support Chat Button */}
      <TouchableOpacity style={styles.floatingSupportButton} onPress={handleSupportPress}>
        <Ionicons name="chatbubble-ellipses" size={moderateScale(28)} color="#ffffff" />
        <View style={styles.floatingOnlineIndicator} />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(20),
  },
  welcomeText: {
    fontSize: moderateScale(16),
    color: '#6b7280',
  },
  userName: {
    fontSize: moderateScale(24),
    fontWeight: '600',
    color: '#065f46',
  },
  notificationButton: {
    position: 'relative',
    padding: scale(8),
  },
  notificationBadge: {
    position: 'absolute',
    top: scale(4),
    right: scale(4),
    backgroundColor: '#ef4444',
    borderRadius: scale(8),
    width: scale(16),
    height: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: moderateScale(10),
    fontWeight: '600',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecfdf5',
    marginHorizontal: scale(24),
    marginBottom: verticalScale(20),
    padding: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    marginRight: scale(12),
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#065f46',
  },
  profileId: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    marginTop: verticalScale(2),
  },
  profileStatus: {
    fontSize: moderateScale(12),
    color: '#059669',
    marginTop: verticalScale(2),
  },
  qrCard: {
    backgroundColor: '#f8fffe',
    marginHorizontal: scale(24),
    marginBottom: verticalScale(20),
    padding: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  qrContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrCodePlaceholder: {
    width: scale(60),
    height: scale(60),
    backgroundColor: '#ecfdf5',
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  qrInfo: {
    flex: 1,
  },
  qrTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#065f46',
  },
  qrSubtitle: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    marginTop: verticalScale(2),
  },
  cardsContainer: {
    marginHorizontal: scale(24),
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(12),
  },
  // New style for section headers with chevron
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  cardsGrid: {
    gap: verticalScale(12),
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fffe',
    padding: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  cardIconContainer: {
    width: scale(60),
    height: scale(60),
    backgroundColor: '#ecfdf5',
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#065f46',
  },
  cardSubtitle: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    marginTop: verticalScale(2),
  },
  cardStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  cardStatusDot: {
    width: scale(6),
    height: scale(6),
    backgroundColor: '#10b981',
    borderRadius: scale(3),
    marginRight: scale(6),
  },
  cardStatus: {
    fontSize: moderateScale(12),
    color: '#059669',
    fontWeight: '500',
  },
  paymentsCard: {
    backgroundColor: '#f8fffe',
    marginHorizontal: scale(24),
    marginBottom: verticalScale(20),
    padding: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentService: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#065f46',
  },
  paymentDate: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    marginTop: verticalScale(2),
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#065f46',
  },
  paymentStatus: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(4),
    marginTop: verticalScale(4),
  },
  statusCompleted: {
    backgroundColor: '#dcfce7',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: moderateScale(10),
    fontWeight: '500',
  },
  statusTextCompleted: {
    color: '#166534',
  },
  statusTextPending: {
    color: '#92400e',
  },
  analyticsCard: {
    backgroundColor: '#f8fffe',
    marginHorizontal: scale(24),
    marginBottom: verticalScale(20),
    padding: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  analyticsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analyticsItem: {
    flex: 1,
  },
  analyticsLabel: {
    fontSize: moderateScale(12),
    color: '#6b7280',
  },
  analyticsValue: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#059669',
    marginTop: verticalScale(4),
  },
  analyticsChange: {
    fontSize: moderateScale(12),
    color: '#059669',
    marginTop: verticalScale(2),
  },
  analyticsChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: scale(40),
  },
  chartBar: {
    width: scale(8),
    height: '100%',
    backgroundColor: '#059669',
    marginHorizontal: scale(2),
    borderRadius: moderateScale(2),
  },
  // New style for "view all" text
  viewAllContainer: {
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: moderateScale(12),
    color: '#059669',
    fontWeight: '500',
  },
  leaderboardCard: {
    backgroundColor: '#f8fffe',
    marginHorizontal: scale(24),
    marginBottom: verticalScale(20),
    padding: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardRank: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#059669',
    width: scale(30),
  },
  leaderboardName: {
    fontSize: moderateScale(14),
    color: '#065f46',
    marginLeft: scale(8),
  },
  leaderboardPoints: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#6b7280',
  },
  bottomSpacing: {
    height: verticalScale(20),
  },
  // Floating Support Button Styles
  floatingSupportButton: {
    position: 'absolute',
    right: scale(20),
    bottom: verticalScale(30),
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 1000,
  },
  floatingOnlineIndicator: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    width: scale(12),
    height: scale(12),
    backgroundColor: '#10b981',
    borderRadius: scale(6),
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});