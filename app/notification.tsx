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
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type NotificationType = 'payment';
type NotificationPriority = 'high' | 'medium' | 'low';

interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  relatedService?: string;
  icon: string;
}

export default function NotificationPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'payment',
      priority: 'high',
      title: 'Payment Due Reminder',
      message: 'Your citizenship renewal fee of Rs. 1,200 is due on February 15, 2024. Pay now to avoid late fees.',
      timestamp: '2024-01-28 10:30 AM',
      isRead: false,
      actionRequired: true,
      relatedService: 'Citizenship Renewal',
      icon: 'card',
    },
    {
      id: '2',
      type: 'payment',
      priority: 'high',
      title: 'Payment Overdue',
      message: 'Your business license fee of Rs. 3,500 is overdue. A fine of Rs. 350 has been added.',
      timestamp: '2024-01-27 02:15 PM',
      isRead: false,
      actionRequired: true,
      relatedService: 'Business License',
      icon: 'warning',
    },
    {
      id: '3',
      type: 'payment',
      priority: 'medium',
      title: 'Payment Successful',
      message: 'Your vehicle registration fee of Rs. 2,500 has been successfully processed. Receipt available.',
      timestamp: '2024-01-27 09:45 AM',
      isRead: true,
      actionRequired: false,
      relatedService: 'Vehicle Registration',
      icon: 'checkmark-circle',
    },
    {
      id: '4',
      type: 'payment',
      priority: 'medium',
      title: 'Payment Reminder',
      message: 'Your water connection fee of Rs. 2,000 is due in 5 days. Pay early to avoid late charges.',
      timestamp: '2024-01-26 11:20 AM',
      isRead: false,
      actionRequired: true,
      relatedService: 'Water Connection',
      icon: 'time',
    },
    {
      id: '5',
      type: 'payment',
      priority: 'low',
      title: 'Payment Receipt Ready',
      message: 'Your payment receipt for PAN card application (Rs. 500) is ready for download.',
      timestamp: '2024-01-25 03:30 PM',
      isRead: true,
      actionRequired: false,
      relatedService: 'PAN Card',
      icon: 'receipt',
    },
    {
      id: '6',
      type: 'payment',
      priority: 'medium',
      title: 'Payment Failed',
      message: 'Your passport application payment of Rs. 5,000 failed. Please try again with a different payment method.',
      timestamp: '2024-01-24 01:45 PM',
      isRead: false,
      actionRequired: true,
      relatedService: 'Passport Application',
      icon: 'close-circle',
    },
    {
      id: '7',
      type: 'payment',
      priority: 'low',
      title: 'Payment Confirmation',
      message: 'Your land tax payment of Rs. 5,000 has been confirmed. Thank you for your prompt payment.',
      timestamp: '2024-01-23 04:10 PM',
      isRead: true,
      actionRequired: false,
      relatedService: 'Land Tax',
      icon: 'checkmark-done',
    },
    {
      id: '8',
      type: 'payment',
      priority: 'medium',
      title: 'Refund Processed',
      message: 'Your refund of Rs. 500 for cancelled marriage certificate has been processed to your account.',
      timestamp: '2024-01-22 10:15 AM',
      isRead: false,
      actionRequired: false,
      relatedService: 'Marriage Certificate',
      icon: 'return-up-back',
    },
    {
      id: '9',
      type: 'payment',
      priority: 'high',
      title: 'Payment Due Today',
      message: 'Your driving license renewal fee of Rs. 1,500 is due today. Pay now to avoid service interruption.',
      timestamp: '2024-01-28 08:00 AM',
      isRead: false,
      actionRequired: true,
      relatedService: 'Driving License',
      icon: 'alert-circle',
    },
    {
      id: '10',
      type: 'payment',
      priority: 'low',
      title: 'Payment Plan Available',
      message: 'You can now pay your property tax of Rs. 15,000 in 3 installments. Set up payment plan now.',
      timestamp: '2024-01-21 02:30 PM',
      isRead: true,
      actionRequired: false,
      relatedService: 'Property Tax',
      icon: 'calendar',
    },
  ]);

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Notifications updated successfully!');
    }, 1500);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    Alert.alert('Success', 'All notifications marked as read!');
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev =>
              prev.filter(notification => notification.id !== notificationId)
            );
          },
        },
      ]
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    if (notification.actionRequired) {
      Alert.alert(
        notification.title,
        `${notification.message}\n\nWould you like to take action now?`,
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Take Action',
            onPress: () => {
              router.push('/paymenthistory');
            },
          },
        ]
      );
    } else {
      Alert.alert(notification.title, notification.message);
    }
  };

  const getNotificationColor = (type: NotificationType, priority: NotificationPriority) => {
    if (priority === 'high') return '#ef4444';
    if (priority === 'medium') return '#f59e0b';
    return '#059669';
  };

  const getPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high': return 'alert-circle';
      case 'medium': return 'information-circle';
      case 'low': return 'checkmark-circle';
      default: return 'information-circle';
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    switch (selectedFilter) {
      case 'unread':
        return !notification.isRead;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        <Text style={styles.headerTitle}>Payment Notifications</Text>
        <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
          <Ionicons name="checkmark-done" size={moderateScale(24)} color="#059669" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'all' && styles.activeFilterTabText]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'unread' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('unread')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'unread' && styles.activeFilterTabText]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
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
        <View style={styles.notificationsList}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.isRead && styles.unreadNotificationCard,
                ]}
                onPress={() => handleNotificationPress(notification)}
              >
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <View style={styles.notificationIconContainer}>
                      <View style={[
                        styles.notificationIcon,
                        { backgroundColor: `${getNotificationColor(notification.type, notification.priority)}15` }
                      ]}>
                        <Ionicons 
                          name={notification.icon as any} 
                          size={moderateScale(20)} 
                          color={getNotificationColor(notification.type, notification.priority)} 
                        />
                      </View>
                      {!notification.isRead && <View style={styles.unreadDot} />}
                    </View>
                    
                    <View style={styles.notificationInfo}>
                      <View style={styles.notificationTitleRow}>
                        <Text style={[
                          styles.notificationTitle,
                          !notification.isRead && styles.unreadNotificationTitle
                        ]}>
                          {notification.title}
                        </Text>
                        <View style={styles.notificationMeta}>
                          <Ionicons 
                            name={getPriorityIcon(notification.priority)} 
                            size={moderateScale(12)} 
                            color={getNotificationColor(notification.type, notification.priority)} 
                          />
                          {notification.actionRequired && (
                            <View style={styles.actionRequiredBadge}>
                              <Text style={styles.actionRequiredText}>Action</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      
                      <Text style={styles.notificationMessage}>
                        {notification.message}
                      </Text>
                      
                      <View style={styles.notificationFooter}>
                        <Text style={styles.notificationTimestamp}>
                          {notification.timestamp}
                        </Text>
                        {notification.relatedService && (
                          <Text style={styles.relatedService}>
                            {notification.relatedService}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.notificationActions}>
                  {!notification.isRead && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                    >
                      <Ionicons name="checkmark" size={moderateScale(16)} color="#059669" />
                      <Text style={styles.actionButtonText}>Mark Read</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                  >
                    <Ionicons name="trash-outline" size={moderateScale(16)} color="#ef4444" />
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={moderateScale(64)} color="#d1d5db" />
              <Text style={styles.emptyStateTitle}>No Payment Notifications</Text>
              <Text style={styles.emptyStateText}>
                {selectedFilter === 'all' 
                  ? 'You have no payment notifications at the moment'
                  : `No ${selectedFilter} payment notifications found`
                }
              </Text>
            </View>
          )}
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
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#065f46',
  },
  markAllButton: {
    padding: scale(8),
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTab: {
    flex: 1,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginHorizontal: scale(4),
  },
  activeFilterTab: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  filterTabText: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#059669',
    fontWeight: '600',
  },
  notificationsList: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16),
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: verticalScale(12),
    overflow: 'hidden',
  },
  unreadNotificationCard: {
    borderColor: '#a7f3d0',
    backgroundColor: '#f8fffe',
  },
  notificationContent: {
    padding: scale(16),
  },
  notificationHeader: {
    flexDirection: 'row',
  },
  notificationIconContainer: {
    position: 'relative',
    marginRight: scale(12),
  },
  notificationIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: scale(12),
    height: scale(12),
    backgroundColor: '#ef4444',
    borderRadius: scale(6),
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(4),
  },
  notificationTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#374151',
    flex: 1,
    marginRight: scale(8),
  },
  unreadNotificationTitle: {
    color: '#065f46',
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  actionRequiredBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(4),
  },
  actionRequiredText: {
    fontSize: moderateScale(10),
    color: '#92400e',
    fontWeight: '600',
  },
  notificationMessage: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(8),
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTimestamp: {
    fontSize: moderateScale(12),
    color: '#9ca3af',
  },
  relatedService: {
    fontSize: moderateScale(12),
    color: '#059669',
    fontWeight: '500',
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
    gap: scale(8),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(6),
    backgroundColor: '#ecfdf5',
    gap: scale(4),
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  actionButtonText: {
    fontSize: moderateScale(12),
    color: '#059669',
    fontWeight: '500',
  },
  deleteButtonText: {
    color: '#ef4444',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyStateTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#374151',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  emptyStateText: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: scale(32),
  },
  bottomSpacing: {
    height: verticalScale(20),
  },
});
