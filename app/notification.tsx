import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { router } from 'expo-router';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      const response = await fetch(`http://localhost:8000/api/users/notifications/${decoded.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error('Notification fetch error:', err);
      Alert.alert('Error', 'Could not load notifications');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        },
      },
    ]);
  };

  const getNotificationColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    selectedFilter === 'unread' ? !n.isRead : true
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#059669" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={() => setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        )}>
          <Ionicons name="checkmark-done" size={24} color="#10b981" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setSelectedFilter('all')}
          style={[styles.tab, selectedFilter === 'all' && styles.activeTab]}
        >
          <Text style={[styles.tabText, selectedFilter === 'all' && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedFilter('unread')}
          style={[styles.tab, selectedFilter === 'unread' && styles.activeTab]}
        >
          <Text style={[styles.tabText, selectedFilter === 'unread' && styles.activeTabText]}>
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={{ padding: 16 }}
      >
        {filteredNotifications.length === 0 ? (
          <Text style={styles.emptyText}>No notifications to show.</Text>
        ) : (
          filteredNotifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.card, !n.isRead && styles.unreadCard]}
              onPress={() => handleMarkAsRead(n.id)}
            >
              <View style={styles.cardContent}>
                <Ionicons
                  name={n.icon as any}
                  size={24}
                  color={getNotificationColor(n.priority)}
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, !n.isRead && styles.unreadTitle]}>{n.title}</Text>
                  <Text style={styles.cardMessage}>{n.message}</Text>
                  <Text style={styles.cardTime}>{n.timestamp}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                {!n.isRead && (
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleMarkAsRead(n.id)}>
                    <Ionicons name="checkmark-circle" size={16} color="#059669" />
                    <Text style={styles.actionText}>Read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#fee2e2' }]} onPress={() => handleDelete(n.id)}>
                  <Ionicons name="trash" size={16} color="#ef4444" />
                  <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#059669',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tab: {
    marginHorizontal: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#d1fae5',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#065f46',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  unreadCard: {
    borderColor: '#34d399',
    backgroundColor: '#ecfdf5',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  unreadTitle: {
    color: '#059669',
  },
  cardMessage: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
  },
  cardTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginLeft: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 40,
  },
});
