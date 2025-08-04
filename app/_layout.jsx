
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ProductProvider } from '../context/ProductContext';
import { OrderProvider } from '../context/OrderContext';
import { AIProvider } from '../context/AIContext';
import { StatusBar } from 'expo-status-bar';

function RootLayoutNav() {
  const { isAuthenticated, isLoading, subscription, isSubscriptionActive } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to dashboard if authenticated and in auth group
      router.replace('/(tabs)/dashboard');
    } else if (isAuthenticated && !isSubscriptionActive() && inTabsGroup) {
      // Check subscription status for protected routes
      const protectedRoutes = ['ai-assistant', 'analytics', 'generate-receipt'];
      const currentRoute = segments[segments.length - 1];
      
      if (protectedRoutes.includes(currentRoute)) {
        router.replace('/subscription');
      }
    }
  }, [isAuthenticated, isLoading, segments, subscription]);

  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <AIProvider>
            <RootLayoutNav />
          </AIProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
