
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionScreen() {
  const { subscription, renewSubscription, user, isSubscriptionActive } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRenewSubscription = async () => {
    Alert.alert(
      'Renew Subscription',
      `Renew your StockFlow subscription for ₦500/month?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Renew',
          onPress: async () => {
            setIsProcessing(true);
            try {
              // In a real app, integrate with payment gateway here
              const success = await renewSubscription();
              if (success) {
                Alert.alert('Success', 'Subscription renewed successfully!');
              } else {
                Alert.alert('Error', 'Failed to renew subscription');
              }
            } catch (error) {
              Alert.alert('Error', 'Payment processing failed');
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = () => {
    if (!subscription) return '#999';
    switch (subscription.status) {
      case 'trial': return '#4CAF50';
      case 'active': return '#2196F3';
      case 'expired': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusText = () => {
    if (!subscription) return 'No Subscription';
    switch (subscription.status) {
      case 'trial': return 'Free Trial';
      case 'active': return 'Active';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5B3CC4" />
        </TouchableOpacity>
        <Text style={styles.title}>Subscription</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
            <Text style={styles.planName}>StockFlow Premium</Text>
          </View>

          {subscription && (
            <View style={styles.statusDetails}>
              {subscription.status === 'trial' && (
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    Trial ends: {formatDate(subscription.trialEndDate)}
                  </Text>
                </View>
              )}
              
              {subscription.status === 'active' && (
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    Next billing: {formatDate(subscription.subscriptionEndDate)}
                  </Text>
                </View>
              )}

              {subscription.status === 'expired' && (
                <View style={styles.detailRow}>
                  <Ionicons name="warning-outline" size={20} color="#F44336" />
                  <Text style={[styles.detailText, { color: '#F44336' }]}>
                    Expired: {formatDate(subscription.subscriptionEndDate)}
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Ionicons name="card-outline" size={20} color="#666" />
                <Text style={styles.detailText}>
                  ₦{subscription.price}/month
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Premium Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Unlimited product inventory</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>AI-powered insights</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Advanced analytics</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>WhatsApp integration</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Receipt generation</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Data backup & sync</Text>
            </View>
          </View>
        </View>

        {subscription && !isSubscriptionActive() && (
          <TouchableOpacity
            style={[styles.renewButton, isProcessing && styles.renewButtonDisabled]}
            onPress={handleRenewSubscription}
            disabled={isProcessing}
          >
            <Ionicons name="card" size={24} color="#fff" />
            <Text style={styles.renewButtonText}>
              {isProcessing ? 'Processing...' : 'Renew Subscription - ₦500/month'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            Contact our support team for billing questions or technical assistance.
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#5B3CC4" />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  featuresCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  renewButton: {
    backgroundColor: '#5B3CC4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#5B3CC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  renewButtonDisabled: {
    opacity: 0.6,
  },
  renewButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  supportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5B3CC4',
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B3CC4',
    marginLeft: 8,
  },
});
