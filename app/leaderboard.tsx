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
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type BadgeType = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

interface User {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  badge: BadgeType;
  level: number;
  completedServices: number;
  streak: number;
  achievements: string[];
  isCurrentUser?: boolean;
  province: string;
  joinDate: string;
}

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

export default function LeaderboardPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'certificates'>('leaderboard');

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Updated', 'Leaderboard refreshed successfully!');
    }, 1500);
  };

  // Mock leaderboard data
  const leaderboardData: User[] = [
    {
      id: '1',
      name: 'Ram Bahadur Sharma',
      points: 2850,
      rank: 1,
      badge: 'diamond',
      level: 15,
      completedServices: 28,
      streak: 45,
      achievements: ['early_adopter', 'service_master', 'streak_champion'],
      province: 'Bagmati',
      joinDate: '2023-01-15',
    },
    {
      id: '2',
      name: 'Sita Kumari Poudel',
      points: 2720,
      rank: 2,
      badge: 'platinum',
      level: 14,
      completedServices: 25,
      streak: 32,
      achievements: ['quick_learner', 'document_expert'],
      province: 'Gandaki',
      joinDate: '2023-02-20',
    },
    {
      id: '3',
      name: 'Hari Krishna Thapa',
      points: 2650,
      rank: 3,
      badge: 'platinum',
      level: 13,
      completedServices: 24,
      streak: 28,
      achievements: ['payment_pro', 'helpful_citizen'],
      province: 'Lumbini',
      joinDate: '2023-03-10',
    },
    {
      id: '4',
      name: 'John Doe',
      points: 2450,
      rank: 4,
      badge: 'gold',
      level: 12,
      completedServices: 22,
      streak: 15,
      achievements: ['first_steps', 'regular_user'],
      isCurrentUser: true,
      province: 'Bagmati',
      joinDate: '2023-06-15',
    },
    {
      id: '5',
      name: 'Maya Gurung',
      points: 2380,
      rank: 5,
      badge: 'gold',
      level: 11,
      completedServices: 21,
      streak: 22,
      achievements: ['mountain_climber', 'service_explorer'],
      province: 'Gandaki',
      joinDate: '2023-04-05',
    },
    {
      id: '6',
      name: 'Bikash Shrestha',
      points: 2250,
      rank: 6,
      badge: 'silver',
      level: 10,
      completedServices: 19,
      streak: 18,
      achievements: ['tech_savvy', 'quick_payer'],
      province: 'Bagmati',
      joinDate: '2023-05-12',
    },
    {
      id: '7',
      name: 'Kamala Devi Rai',
      points: 2180,
      rank: 7,
      badge: 'silver',
      level: 10,
      completedServices: 18,
      streak: 12,
      achievements: ['community_helper'],
      province: 'Province 1',
      joinDate: '2023-07-08',
    },
    {
      id: '8',
      name: 'Rajesh Kumar Yadav',
      points: 2050,
      rank: 8,
      badge: 'bronze',
      level: 9,
      completedServices: 16,
      streak: 8,
      achievements: ['newcomer'],
      province: 'Madhesh',
      joinDate: '2023-08-20',
    },
  ];

  // Certificate data - only Top Tax Payer
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

  const getBadgeColor = (badge: BadgeType) => {
    switch (badge) {
      case 'diamond': return '#e0e7ff';
      case 'platinum': return '#f3f4f6';
      case 'gold': return '#fef3c7';
      case 'silver': return '#f1f5f9';
      case 'bronze': return '#fed7aa';
      default: return '#f3f4f6';
    }
  };

  const getBadgeIcon = (badge: BadgeType) => {
    switch (badge) {
      case 'diamond': return 'diamond';
      case 'platinum': return 'medal';
      case 'gold': return 'trophy';
      case 'silver': return 'ribbon';
      case 'bronze': return 'star';
      default: return 'star';
    }
  };

  const handleUserPress = (user: User) => {
    Alert.alert(
      `${user.name}'s Profile`,
      `Level: ${user.level}\nPoints: ${user.points.toLocaleString()}\nCompleted Services: ${user.completedServices}\nStreak: ${user.streak} days\nProvince: ${user.province}\nJoined: ${user.joinDate}`,
      [{ text: 'OK' }]
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
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <TouchableOpacity style={styles.infoButton} onPress={() => Alert.alert('Info', 'Earn points by completing government services, maintaining streaks, and helping other citizens!')}>
          <Ionicons name="information-circle" size={moderateScale(24)} color="#059669" />
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setSelectedTab('leaderboard')}
        >
          <Ionicons name="trophy" size={moderateScale(20)} color={selectedTab === 'leaderboard' ? '#059669' : '#6b7280'} />
          <Text style={[styles.tabText, selectedTab === 'leaderboard' && styles.activeTabText]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'certificates' && styles.activeTab]}
          onPress={() => setSelectedTab('certificates')}
        >
          <Ionicons name="ribbon" size={moderateScale(20)} color={selectedTab === 'certificates' ? '#059669' : '#6b7280'} />
          <Text style={[styles.tabText, selectedTab === 'certificates' && styles.activeTabText]}>
            Certificate
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#059669']}
            tintColor="#059669"
          />
        }
      >
        {selectedTab === 'leaderboard' ? (
          <>
            {/* Top 3 Podium */}
            <View style={styles.podiumContainer}>
              <Text style={styles.sectionTitle}>Top Citizens</Text>
              <View style={styles.podium}>
                {/* 2nd Place */}
                <View style={[styles.podiumPlace, styles.secondPlace]}>
                  <View style={styles.podiumUser}>
                    <View style={[styles.podiumAvatar, { backgroundColor: getBadgeColor(leaderboardData[1].badge) }]}>
                      <Ionicons name={getBadgeIcon(leaderboardData[1].badge)} size={moderateScale(24)} color="#6b7280" />
                    </View>
                    <Text style={styles.podiumName}>{leaderboardData[1].name.split(' ')[0]}</Text>
                    <Text style={styles.podiumPoints}>{leaderboardData[1].points.toLocaleString()}</Text>
                  </View>
                  <View style={[styles.podiumRank, styles.silverRank]}>
                    <Text style={styles.podiumRankText}>2</Text>
                  </View>
                </View>

                {/* 1st Place */}
                <View style={[styles.podiumPlace, styles.firstPlace]}>
                  <View style={styles.crownContainer}>
                    <Ionicons name="crown" size={moderateScale(32)} color="#fbbf24" />
                  </View>
                  <View style={styles.podiumUser}>
                    <View style={[styles.podiumAvatar, styles.winnerAvatar, { backgroundColor: getBadgeColor(leaderboardData[0].badge) }]}>
                      <Ionicons name={getBadgeIcon(leaderboardData[0].badge)} size={moderateScale(28)} color="#fbbf24" />
                    </View>
                    <Text style={[styles.podiumName, styles.winnerName]}>{leaderboardData[0].name.split(' ')[0]}</Text>
                    <Text style={[styles.podiumPoints, styles.winnerPoints]}>{leaderboardData[0].points.toLocaleString()}</Text>
                  </View>
                  <View style={[styles.podiumRank, styles.goldRank]}>
                    <Text style={styles.podiumRankText}>1</Text>
                  </View>
                </View>

                {/* 3rd Place */}
                <View style={[styles.podiumPlace, styles.thirdPlace]}>
                  <View style={styles.podiumUser}>
                    <View style={[styles.podiumAvatar, { backgroundColor: getBadgeColor(leaderboardData[2].badge) }]}>
                      <Ionicons name={getBadgeIcon(leaderboardData[2].badge)} size={moderateScale(24)} color="#6b7280" />
                    </View>
                    <Text style={styles.podiumName}>{leaderboardData[2].name.split(' ')[0]}</Text>
                    <Text style={styles.podiumPoints}>{leaderboardData[2].points.toLocaleString()}</Text>
                  </View>
                  <View style={[styles.podiumRank, styles.bronzeRank]}>
                    <Text style={styles.podiumRankText}>3</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Full Leaderboard */}
            <View style={styles.leaderboardList}>
              <Text style={styles.sectionTitle}>All Rankings</Text>
              {leaderboardData.map((user, index) => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.leaderboardItem,
                    user.isCurrentUser && styles.currentUserItem,
                  ]}
                  onPress={() => handleUserPress(user)}
                >
                  <View style={styles.userRank}>
                    <Text style={[
                      styles.rankText,
                      user.rank <= 3 && styles.topRankText,
                      user.isCurrentUser && styles.currentUserRankText,
                    ]}>
                      #{user.rank}
                    </Text>
                  </View>
                  
                  <View style={styles.userInfo}>
                    <View style={[styles.userAvatar, { backgroundColor: getBadgeColor(user.badge) }]}>
                      <Ionicons name={getBadgeIcon(user.badge)} size={moderateScale(20)} color="#059669" />
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={[styles.userName, user.isCurrentUser && styles.currentUserName]}>
                        {user.name} {user.isCurrentUser && '(You)'}
                      </Text>
                      <View style={styles.userMeta}>
                        <Text style={styles.userLevel}>Level {user.level}</Text>
                        <Text style={styles.userProvince}>{user.province}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.userStats}>
                    <Text style={[styles.userPoints, user.isCurrentUser && styles.currentUserPoints]}>
                      {user.points.toLocaleString()}
                    </Text>
                    <View style={styles.userBadges}>
                      <Ionicons name="flame" size={moderateScale(12)} color="#f59e0b" />
                      <Text style={styles.streakText}>{user.streak}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          /* Certificate Tab */
          <View style={styles.certificateContainer}>
            <Text style={styles.sectionTitle}>Your Certificate</Text>
            <Text style={styles.certificateSubtitle}>
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
        )}

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
  infoButton: {
    padding: scale(8),
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  tabText: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#059669',
    fontWeight: '600',
  },
  podiumContainer: {
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(16),
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: scale(8),
  },
  podiumPlace: {
    alignItems: 'center',
    flex: 1,
  },
  firstPlace: {
    marginBottom: verticalScale(20),
  },
  secondPlace: {
    marginBottom: verticalScale(10),
  },
  thirdPlace: {
    marginBottom: 0,
  },
  crownContainer: {
    position: 'absolute',
    top: -verticalScale(20),
    zIndex: 1,
  },
  podiumUser: {
    alignItems: 'center',
    backgroundColor: '#f8fffe',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: scale(12),
    minHeight: verticalScale(120),
    justifyContent: 'center',
  },
  podiumAvatar: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  winnerAvatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    borderWidth: 3,
    borderColor: '#fbbf24',
  },
  podiumName: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#065f46',
    textAlign: 'center',
  },
  winnerName: {
    fontSize: moderateScale(14),
    color: '#fbbf24',
  },
  podiumPoints: {
    fontSize: moderateScale(10),
    color: '#6b7280',
    marginTop: verticalScale(2),
  },
  winnerPoints: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  podiumRank: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  goldRank: {
    backgroundColor: '#fbbf24',
  },
  silverRank: {
    backgroundColor: '#e5e7eb',
  },
  bronzeRank: {
    backgroundColor: '#f97316',
  },
  podiumRankText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#ffffff',
  },
  leaderboardList: {
    paddingHorizontal: scale(24),
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fffe',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: scale(16),
    marginBottom: verticalScale(8),
  },
  currentUserItem: {
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
    borderColor: '#059669',
  },
  userRank: {
    width: scale(40),
    alignItems: 'center',
  },
  rankText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#6b7280',
  },
  topRankText: {
    color: '#059669',
  },
  currentUserRankText: {
    color: '#065f46',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: scale(12),
  },
  userAvatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#374151',
  },
  currentUserName: {
    color: '#065f46',
  },
  userMeta: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: verticalScale(2),
  },
  userLevel: {
    fontSize: moderateScale(12),
    color: '#6b7280',
  },
  userProvince: {
    fontSize: moderateScale(12),
    color: '#6b7280',
  },
  userStats: {
    alignItems: 'flex-end',
  },
  userPoints: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#059669',
  },
  userBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
    gap: scale(4),
  },
  streakText: {
    fontSize: moderateScale(12),
    color: '#f59e0b',
    fontWeight: '500',
  },
  // Certificate styles
  certificateContainer: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16),
  },
  certificateSubtitle: {
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
    height: verticalScale(32),
  },
});