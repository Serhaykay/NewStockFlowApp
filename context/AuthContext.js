
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    checkBiometricSupport();
    checkAuthState();
    checkSubscriptionStatus();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricSupported(compatible && enrolled);
  };

  const checkAuthState = async () => {
    try {
      const userToken = await SecureStore.getItemAsync('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (userToken && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          setIsAuthenticated(true);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          // Clear corrupted data
          await SecureStore.deleteItemAsync('userToken');
          await AsyncStorage.removeItem('userData');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };


  const checkSubscriptionStatus = async () => {
    try {
      const subData = await AsyncStorage.getItem('subscriptionData');
      if (subData) {
        const subscription = JSON.parse(subData);
        const now = new Date();
        const trialEnd = new Date(subscription.trialEndDate);
        const subscriptionEnd = new Date(subscription.subscriptionEndDate);

        if (now > subscriptionEnd) {
          subscription.status = 'expired';
        } else if (now > trialEnd && subscription.status === 'trial') {
          subscription.status = 'active';
        }

        setSubscription(subscription);
        await AsyncStorage.setItem('subscriptionData', JSON.stringify(subscription));
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access StockFlow',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const createProfile = async (profileData) => {
    try {
      const userData = {
        ...profileData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      // Create initial subscription with 1-month free trial
      const subscriptionData = {
        status: 'trial',
        trialStartDate: new Date().toISOString(),
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        subscriptionEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        price: 500,
        currency: 'NGN'
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('subscriptionData', JSON.stringify(subscriptionData));
      await SecureStore.setItemAsync('userToken', userData.id);
      
      setUser(userData);
      setSubscription(subscriptionData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      return false;
    }
  };

  const login = async () => {
    try {
      if (biometricSupported) {
        const success = await authenticateWithBiometrics();
        if (success) {
          setIsAuthenticated(true);
          return true;
        }
      } else {
        // Fallback for devices without biometric support
        const userToken = await SecureStore.getItemAsync('userToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (userToken && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
  try {
    await SecureStore.deleteItemAsync('userToken');
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('subscriptionData');
    setUser(null);
    setSubscription(null);
    setIsAuthenticated(false);
  } catch (error) {
    console.error('Logout error:', error);
  }
};


  const renewSubscription = async () => {
    try {
      const newSubscriptionData = {
        ...subscription,
        status: 'active',
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastPaymentDate: new Date().toISOString()
      };

      await AsyncStorage.setItem('subscriptionData', JSON.stringify(newSubscriptionData));
      setSubscription(newSubscriptionData);
      return true;
    } catch (error) {
      console.error('Error renewing subscription:', error);
      return false;
    }
  };

  const isSubscriptionActive = () => {
    if (!subscription) return false;
    const now = new Date();
    const subscriptionEnd = new Date(subscription.subscriptionEndDate);
    
    if (subscription.status === 'expired' || now > subscriptionEnd) {
      return false;
    }
    
    return subscription.status === 'trial' || subscription.status === 'active';
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    biometricSupported,
    subscription,
    login,
    logout,
    createProfile,
    authenticateWithBiometrics,
    renewSubscription,
    isSubscriptionActive,
    checkSubscriptionStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
