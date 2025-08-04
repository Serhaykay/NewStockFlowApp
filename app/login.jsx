import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';


export default function LoginScreen() {
  const { login, biometricSupported, user, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Optional: Prevent auto-redirect; allows users to choose to set up profile
  }, []);

  const handleBiometricLogin = async () => {
    if (isAuthenticating) return;
    
    setIsAuthenticating(true);
    try {
      const success = await login();
      if (success) {
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Authentication Failed', 'Please try again or contact support.');
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSetupProfile = () => {
    router.push('/profile-setup');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="cube" size={48} color="#5B3CC4" />
          </View>
          <Text style={styles.title}>StockFlow</Text>
          <Text style={styles.subtitle}>Smart Inventory Management</Text>
        </View>

        <View style={styles.welcomeContainer}>
          {user ? (
            <>
              <Text style={styles.welcomeText}>
                Welcome back, {user.ownerName}!
              </Text>
              <Text style={styles.businessText}>{user.businessName}</Text>
            </>
          ) : (
            <Text style={styles.welcomeText}>Welcome to StockFlow</Text>
          )}
        </View>

        <View style={styles.authContainer}>
          {biometricSupported && user ? (
            <TouchableOpacity
              style={[styles.authButton, isAuthenticating && styles.authButtonDisabled]}
              onPress={handleBiometricLogin}
              disabled={isAuthenticating}
            >
              <Ionicons name="finger-print" size={24} color="#fff" style={styles.authIcon} />
              <Text style={styles.authButtonText}>
                {isAuthenticating ? 'Authenticating...' : 'Unlock with Biometrics'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fallbackContainer}>
              <Ionicons name="lock-closed" size={24} color="#999" />
              <Text style={styles.fallbackText}>
                {!user ? 'Please set up your profile first' : 'Biometric authentication not available'}
              </Text>
            </View>
          )}

          {!user && (
            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: '#25D366' }]}
              onPress={handleSetupProfile}
            >
              <Ionicons name="person-add" size={24} color="#fff" style={styles.authIcon} />
              <Text style={styles.authButtonText}>Set Up Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="cube-outline" size={20} color="#5B3CC4" />
              <Text style={styles.featureText}>Inventory Management</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="analytics-outline" size={20} color="#5B3CC4" />
              <Text style={styles.featureText}>Sales Analytics</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="chatbubble-outline" size={20} color="#5B3CC4" />
              <Text style={styles.featureText}>AI Assistant</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <Text style={styles.featureText}>WhatsApp Integration</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#5B3CC4',
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#5B3CC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5B3CC4',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  businessText: {
    fontSize: 18,
    color: '#5B3CC4',
    fontWeight: '500',
  },
  authContainer: {
    marginBottom: 40,
  },
  authButton: {
    backgroundColor: '#5B3CC4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authIcon: {
    marginRight: 12,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  fallbackContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
  },
  fallbackText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  featuresContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
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
    fontWeight: '500',
  },
});