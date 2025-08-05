
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
    const onIndexPage = segments.length === 0;
    const onLoginPage = segments[0] === 'login';
    const onProfileSetupPage = segments[0] === 'profile-setup';

    // Allow index page to handle its own routing logic
    if (onIndexPage) return;

    if (!isAuthenticated && !inAuthGroup && !onLoginPage && !onProfileSetupPage) {
      // Redirect to login if not authenticated and not on login/profile-setup pages
      router.replace('/login');
    } else if (isAuthenticated && (inAuthGroup || onLoginPage)) {
      // Redirect to dashboard if authenticated and on auth pages
      console.log('User authenticated, redirecting to dashboard from layout guard');
      router.replace('/(tabs)/dashboard');
    } else if (isAuthenticated && !isSubscriptionActive() && inTabsGroup) {
      // Check subscription status for protected routes
      const protectedRoutes = ['ai-assistant', 'analytics', 'generate-receipt'];
      const currentRoute = segments[segments.length - 1];
      
      if (protectedRoutes.includes(currentRoute)) {
        router.replace('/subscription');
      }
    }
  }, [isAuthenticated, isLoading, segments, subscription, router]);

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
