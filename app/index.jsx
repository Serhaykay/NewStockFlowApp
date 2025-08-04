
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated && user) {
          router.replace('/(tabs)/dashboard');
        } else {
          router.replace('/login');
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>SF</Text>
        </View>
        <Text style={styles.title}>StockFlow</Text>
        <Text style={styles.version}>v1.0.0</Text>
      </Animated.View>
      <ActivityIndicator size="large" color="#5B3CC4" style={{ marginTop: 30 }} />
      <Text style={styles.tagline}>Smart inventory made simple</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9FF',
    padding: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: '#5B3CC4',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5B3CC4',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
});
