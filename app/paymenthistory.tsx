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
TextInput,
Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type PaymentStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded' | 'Overdue';
type FilterType = 'All' | 'Completed' | 'Pending' | 'Failed' | 'Refunded' | 'Overdue';

interface Payment {
id: string;
service: string;
amount: number;
currency: string;
date: string;
time: string;
dueDate?: string;
status: PaymentStatus;
transactionId: string;
paymentMethod: string;
category: string;
description?: string;
fineAmount?: number;
}

export default function PaymentPage() {
const [searchQuery, setSearchQuery] = useState('');
const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
const [showFilters, setShowFilters] = useState(false);

const handleGoBack = () => {
  router.back();
};

const handlePaymentPress = (payment: Payment) => {
  const fineText = payment.fineAmount ? `\nFine Amount: ${payment.currency} ${payment.fineAmount.toLocaleString()}` : '';
  const dueDateText = payment.dueDate ? `\nDue Date: ${payment.dueDate}` : '';
  
  Alert.alert(
    'Payment Details',
    `Service: ${payment.service}
Amount: ${payment.currency} ${payment.amount.toLocaleString()}${fineText}
Transaction ID: ${payment.transactionId}
Payment Method: ${payment.paymentMethod}
Date: ${payment.date} at ${payment.time}${dueDateText}
Status: ${payment.status}`,
    [{ text: 'OK' }]
  );
};

const handlePayNow = (payment: Payment) => {
  const totalAmount = payment.amount + (payment.fineAmount || 0);
  const fineText = payment.fineAmount ? ` (including fine: Rs. ${payment.fineAmount.toLocaleString()})` : '';
  
  Alert.alert(
    'Pay Now',
    `Pay ${payment.currency} ${totalAmount.toLocaleString()}${fineText} for ${payment.service}?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Pay Now', 
        onPress: () => {
          Alert.alert('Payment Initiated', 'Redirecting to payment gateway...');
          // Here you would integrate with actual payment gateway
        }
      },
    ]
  );
};

const handleDownloadReceipt = (payment: Payment) => {
  Alert.alert(
    'Download Receipt',
    `Download receipt for ${payment.service}?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Download', onPress: () => Alert.alert('Success', 'Receipt downloaded successfully!') },
    ]
  );
};

const handleRefundRequest = (payment: Payment) => {
  Alert.alert(
    'Request Refund',
    `Request refund for ${payment.service}?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Request', onPress: () => Alert.alert('Success', 'Refund request submitted successfully!') },
    ]
  );
};

// Mock payment data - I'll make sure we have clear pending payments
const allPayments: Payment[] = [
  {
    id: '1',
    service: 'Vehicle Registration',
    amount: 2500,
    currency: 'Rs.',
    date: '2024-01-15',
    time: '10:30 AM',
    status: 'Completed',
    transactionId: 'TXN001234567',
    paymentMethod: 'eSewa',
    category: 'Vehicle Services',
    description: 'Annual vehicle registration renewal',
  },
  {
    id: '2',
    service: 'Citizenship Renewal',
    amount: 1200,
    currency: 'Rs.',
    date: '2024-01-12',
    time: '02:15 PM',
    dueDate: '2024-02-15',
    status: 'Pending',
    transactionId: 'TXN001234568',
    paymentMethod: 'Pending',
    category: 'Identity Documents',
    description: 'Citizenship certificate renewal fee',
  },
  {
    id: '3',
    service: 'License Fee',
    amount: 800,
    currency: 'Rs.',
    date: '2024-01-10',
    time: '09:45 AM',
    status: 'Completed',
    transactionId: 'TXN001234569',
    paymentMethod: 'Bank Transfer',
    category: 'License Services',
  },
  {
    id: '4',
    service: 'Passport Application',
    amount: 5000,
    currency: 'Rs.',
    date: '2024-01-08',
    time: '11:20 AM',
    status: 'Failed',
    transactionId: 'TXN001234570',
    paymentMethod: 'Credit Card',
    category: 'Travel Documents',
    description: 'New passport application fee',
  },
  {
    id: '5',
    service: 'Birth Certificate',
    amount: 300,
    currency: 'Rs.',
    date: '2024-01-05',
    time: '03:30 PM',
    status: 'Completed',
    transactionId: 'TXN001234571',
    paymentMethod: 'eSewa',
    category: 'Civil Documents',
  },
  {
    id: '6',
    service: 'Marriage Certificate',
    amount: 500,
    currency: 'Rs.',
    date: '2024-01-03',
    time: '01:45 PM',
    status: 'Refunded',
    transactionId: 'TXN001234572',
    paymentMethod: 'Khalti',
    category: 'Civil Documents',
    description: 'Marriage certificate application - cancelled',
  },
  {
    id: '7',
    service: 'Property Tax',
    amount: 15000,
    currency: 'Rs.',
    date: '2023-12-28',
    time: '04:10 PM',
    status: 'Completed',
    transactionId: 'TXN001234573',
    paymentMethod: 'Bank Transfer',
    category: 'Tax Services',
    description: 'Annual property tax payment',
  },
  {
    id: '8',
    service: 'Business License',
    amount: 3500,
    currency: 'Rs.',
    date: '2023-12-25',
    time: '10:15 AM',
    dueDate: '2023-12-20',
    status: 'Overdue',
    transactionId: 'TXN001234574',
    paymentMethod: 'Pending',
    category: 'Business Services',
    fineAmount: 350,
  },
  {
    id: '9',
    service: 'Water Connection Fee',
    amount: 2000,
    currency: 'Rs.',
    date: '2024-01-20',
    time: '11:30 AM',
    dueDate: '2024-02-05',
    status: 'Pending',
    transactionId: 'TXN001234575',
    paymentMethod: 'Pending',
    category: 'Utility Services',
    description: 'New water connection application fee',
  },
  {
    id: '10',
    service: 'Land Tax',
    amount: 5000,
    currency: 'Rs.',
    date: '2024-01-25',
    time: '09:00 AM',
    dueDate: '2024-02-10',
    status: 'Pending',
    transactionId: 'TXN001234576',
    paymentMethod: 'Pending',
    category: 'Tax Services',
    description: 'Annual land tax payment',
  },
];

const filters: FilterType[] = ['All', 'Completed', 'Pending', 'Overdue', 'Failed', 'Refunded'];

// Filter and search logic
const filteredPayments = allPayments.filter(payment => {
  const matchesSearch = payment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesFilter = selectedFilter === 'All' || payment.status === selectedFilter;
  return matchesSearch && matchesFilter;
});

// Calculate summary statistics
const totalAmount = allPayments
  .filter(p => p.status === 'Completed')
  .reduce((sum, payment) => sum + payment.amount, 0);

const completedCount = allPayments.filter(p => p.status === 'Completed').length;
const pendingCount = allPayments.filter(p => p.status === 'Pending' || p.status === 'Overdue').length;

const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case 'Completed': return '#10b981';
    case 'Pending': return '#f59e0b';
    case 'Overdue': return '#dc2626';
    case 'Failed': return '#ef4444';
    case 'Refunded': return '#6b7280';
    default: return '#6b7280';
  }
};

const getStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case 'Completed': return 'checkmark-circle';
    case 'Pending': return 'time';
    case 'Overdue': return 'warning';
    case 'Failed': return 'close-circle';
    case 'Refunded': return 'return-up-back';
    default: return 'help-circle';
  }
};

const getPaymentMethodIcon = (method: string) => {
  switch (method.toLowerCase()) {
    case 'esewa': return 'wallet';
    case 'khalti': return 'card';
    case 'bank transfer': return 'business';
    case 'credit card': return 'card';
    case 'pending': return 'time';
    default: return 'card';
  }
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
      <Text style={styles.headerTitle}>Payment</Text>
      <TouchableOpacity 
        style={styles.filterButton} 
        onPress={() => setShowFilters(!showFilters)}
      >
        <Ionicons name="filter" size={moderateScale(24)} color="#059669" />
      </TouchableOpacity>
    </View>

    {/* Search Bar */}
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={moderateScale(20)} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search payments or transaction ID..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={moderateScale(20)} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>

    {/* Filter Chips */}
    {showFilters && (
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterChips}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.activeFilterChip,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === filter && styles.activeFilterChipText,
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    )}

    {/* Summary Cards */}
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryValue}>Rs. {totalAmount.toLocaleString()}</Text>
        <Text style={styles.summaryLabel}>Total Paid</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{completedCount}</Text>
        <Text style={styles.summaryLabel}>Completed</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{pendingCount}</Text>
        <Text style={styles.summaryLabel}>Pending</Text>
      </View>
    </View>

    {/* Payment List */}
    <ScrollView 
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.paymentsList}>
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => (
            <TouchableOpacity
              key={payment.id}
              style={styles.paymentCard}
              onPress={() => handlePaymentPress(payment)}
            >
              <View style={styles.paymentHeader}>
                <View style={styles.paymentMainInfo}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{payment.service}</Text>
                    <Text style={styles.serviceCategory}>{payment.category}</Text>
                  </View>
                  <View style={styles.amountInfo}>
                    <Text style={styles.amount}>
                      {payment.currency} {payment.amount.toLocaleString()}
                    </Text>
                    {payment.fineAmount && (
                      <Text style={styles.fineAmount}>
                        + Fine: {payment.currency} {payment.fineAmount.toLocaleString()}
                      </Text>
                    )}
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(payment.status)}15` }]}>
                      <Ionicons 
                        name={getStatusIcon(payment.status)} 
                        size={moderateScale(12)} 
                        color={getStatusColor(payment.status)} 
                      />
                      <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                        {payment.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.paymentDetails}>
                <View style={styles.paymentDetailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={moderateScale(14)} color="#6b7280" />
                    <Text style={styles.detailText}>{payment.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time" size={moderateScale(14)} color="#6b7280" />
                    <Text style={styles.detailText}>{payment.time}</Text>
                  </View>
                </View>
                
                {payment.dueDate && (
                  <View style={styles.paymentDetailRow}>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar-outline" size={moderateScale(14)} color="#6b7280" />
                      <Text style={styles.detailText}>Due: {payment.dueDate}</Text>
                    </View>
                  </View>
                )}
                
                <View style={styles.paymentDetailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name={getPaymentMethodIcon(payment.paymentMethod)} size={moderateScale(14)} color="#6b7280" />
                    <Text style={styles.detailText}>{payment.paymentMethod}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="receipt" size={moderateScale(14)} color="#6b7280" />
                    <Text style={styles.detailText}>{payment.transactionId}</Text>
                  </View>
                </View>

                {payment.description && (
                  <Text style={styles.paymentDescription}>{payment.description}</Text>
                )}
              </View>

              {/* Payment Actions - Pay Now button should be here */}
              <View style={styles.paymentActions}>
                {/* Debug: Let's make sure this condition works */}
                {(payment.status === 'Pending' || payment.status === 'Overdue') && (
                  <TouchableOpacity
                    style={styles.payNowButton}
                    onPress={() => handlePayNow(payment)}
                  >
                    <Ionicons name="card" size={moderateScale(16)} color="#ffffff" />
                    <Text style={styles.payNowText}>Pay Now</Text>
                  </TouchableOpacity>
                )}
                
                {/* Other action buttons */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDownloadReceipt(payment)}
                >
                  <Ionicons name="download-outline" size={moderateScale(16)} color="#059669" />
                  <Text style={styles.actionButtonText}>Receipt</Text>
                </TouchableOpacity>
                
                {payment.status === 'Completed' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRefundRequest(payment)}
                  >
                    <Ionicons name="return-up-back-outline" size={moderateScale(16)} color="#f59e0b" />
                    <Text style={[styles.actionButtonText, { color: '#f59e0b' }]}>Refund</Text>
                  </TouchableOpacity>
                )}
                
                {payment.status === 'Failed' && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handlePayNow(payment)}
                  >
                    <Ionicons name="refresh-outline" size={moderateScale(16)} color="#059669" />
                    <Text style={styles.actionButtonText}>Retry</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={moderateScale(64)} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No Payments Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || selectedFilter !== 'All' 
                ? 'Try adjusting your search or filters'
                : 'Your payment history will appear here'
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
filterButton: {
  padding: scale(8),
},
searchContainer: {
  paddingHorizontal: scale(24),
  paddingVertical: verticalScale(16),
},
searchInputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f9fafb',
  borderRadius: moderateScale(12),
  paddingHorizontal: scale(16),
  paddingVertical: verticalScale(12),
  borderWidth: 1,
  borderColor: '#e5e7eb',
},
searchInput: {
  flex: 1,
  fontSize: moderateScale(16),
  color: '#374151',
  marginLeft: scale(12),
},
filtersContainer: {
  paddingHorizontal: scale(24),
  paddingBottom: verticalScale(16),
},
filterChips: {
  flexDirection: 'row',
  gap: scale(8),
},
filterChip: {
  paddingHorizontal: scale(16),
  paddingVertical: verticalScale(8),
  borderRadius: moderateScale(20),
  backgroundColor: '#f3f4f6',
  borderWidth: 1,
  borderColor: '#e5e7eb',
},
activeFilterChip: {
  backgroundColor: '#059669',
  borderColor: '#059669',
},
filterChipText: {
  fontSize: moderateScale(14),
  color: '#6b7280',
  fontWeight: '500',
},
activeFilterChipText: {
  color: '#ffffff',
},
summaryContainer: {
  flexDirection: 'row',
  paddingHorizontal: scale(24),
  paddingBottom: verticalScale(20),
  gap: scale(12),
},
summaryCard: {
  flex: 1,
  backgroundColor: '#f8fffe',
  borderRadius: moderateScale(12),
  borderWidth: 1,
  borderColor: '#a7f3d0',
  padding: scale(16),
  alignItems: 'center',
},
summaryValue: {
  fontSize: moderateScale(18),
  fontWeight: '700',
  color: '#059669',
  marginBottom: verticalScale(4),
},
summaryLabel: {
  fontSize: moderateScale(12),
  color: '#6b7280',
},
paymentsList: {
  paddingHorizontal: scale(24),
},
paymentCard: {
  backgroundColor: '#f8fffe',
  borderRadius: moderateScale(16),
  borderWidth: 1,
  borderColor: '#a7f3d0',
  padding: scale(20),
  marginBottom: verticalScale(16),
},
paymentHeader: {
  marginBottom: verticalScale(16),
},
paymentMainInfo: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
},
serviceInfo: {
  flex: 1,
},
serviceName: {
  fontSize: moderateScale(18),
  fontWeight: '600',
  color: '#065f46',
  marginBottom: verticalScale(4),
},
serviceCategory: {
  fontSize: moderateScale(14),
  color: '#6b7280',
},
amountInfo: {
  alignItems: 'flex-end',
},
amount: {
  fontSize: moderateScale(18),
  fontWeight: '700',
  color: '#065f46',
  marginBottom: verticalScale(4),
},
fineAmount: {
  fontSize: moderateScale(14),
  fontWeight: '600',
  color: '#dc2626',
  marginBottom: verticalScale(8),
},
statusBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: scale(8),
  paddingVertical: verticalScale(4),
  borderRadius: moderateScale(12),
  gap: scale(4),
},
statusText: {
  fontSize: moderateScale(12),
  fontWeight: '500',
},
paymentDetails: {
  paddingTop: verticalScale(16),
  borderTopWidth: 1,
  borderTopColor: '#e5e7eb',
  marginBottom: verticalScale(16),
},
paymentDetailRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: verticalScale(8),
},
detailItem: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  gap: scale(6),
},
detailText: {
  fontSize: moderateScale(12),
  color: '#6b7280',
  flex: 1,
},
paymentDescription: {
  fontSize: moderateScale(14),
  color: '#6b7280',
  fontStyle: 'italic',
  marginTop: verticalScale(8),
},
paymentActions: {
  flexDirection: 'row',
  gap: scale(12),
  paddingTop: verticalScale(16),
  borderTopWidth: 1,
  borderTopColor: '#e5e7eb',
  flexWrap: 'wrap',
},
// Separate styles for Pay Now button to make it more prominent
payNowButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#059669',
  paddingHorizontal: scale(20),
  paddingVertical: verticalScale(10),
  borderRadius: moderateScale(8),
  gap: scale(6),
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
payNowText: {
  fontSize: moderateScale(14),
  color: '#ffffff',
  fontWeight: '600',
},
actionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#ecfdf5',
  paddingHorizontal: scale(16),
  paddingVertical: verticalScale(8),
  borderRadius: moderateScale(8),
  gap: scale(4),
},
actionButtonText: {
  fontSize: moderateScale(12),
  color: '#059669',
  fontWeight: '500',
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