import { Alert } from 'react-native';

export const safeNavigate = (router, path, options = {}) => {
  try {
    console.log(`Navigating to: ${path}`);
    
    if (options.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
    
    return true;
  } catch (error) {
    console.error('Navigation error:', error);
    Alert.alert(
      'Navigation Error', 
      `Failed to navigate to ${path}. Please try again.`,
      [{ text: 'OK' }]
    );
    return false;
  }
};

export const navigateToDashboard = (router) => {
  return safeNavigate(router, '/(tabs)/dashboard', { replace: true });
};

export const navigateToLogin = (router) => {
  return safeNavigate(router, '/login', { replace: true });
};

export const navigateToProfileSetup = (router) => {
  return safeNavigate(router, '/profile-setup');
};