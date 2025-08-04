
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function SubscriptionGuard({ children, feature = 'this feature' }) {
  const { subscription, isSubscriptionActive } = useAuth();
  const router = useRouter();

  if (isSubscriptionActive()) {
    return children;
  }

  const handleUpgrade = () => {
    Alert.alert(
      'Premium Feature',
      `${feature} is available for premium subscribers only. Upgrade now?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Upgrade', 
          onPress: () => router.push('/subscription')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={48} color="#5B3CC4" />
        </View>
        <Text style={styles.title}>Premium Feature</Text>
        <Text style={styles.description}>
          {feature} is available for premium subscribers.
        </Text>
        <Text style={styles.trialInfo}>
          {subscription?.status === 'trial' 
            ? 'Your trial has expired. Upgrade to continue using premium features.'
            : 'Start your free trial today!'}
        </Text>
        
        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
          <Ionicons name="diamond" size={20} color="#fff" />
          <Text style={styles.upgradeButtonText}>
            Upgrade to Premium - ₦500/month
          </Text>
        </TouchableOpacity>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Premium includes:</Text>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>Unlimited inventory</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>AI assistant</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>Advanced analytics</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    backgroundColor: '#F0EFFF',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  trialInfo: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: '#5B3CC4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  features: {
    alignSelf: 'stretch',
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});
