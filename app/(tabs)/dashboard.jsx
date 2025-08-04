
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useProductContext } from '../../context/ProductContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const { products, orders, getLowStockProducts } = useProductContext();

  const todaysOrders = orders.filter(order => {
    const today = new Date().toDateString();
    return new Date(order.date).toDateString() === today;
  });

  const todaysSales = todaysOrders.reduce((sum, order) => sum + order.total, 0);
  const lowStockCount = getLowStockProducts().length;

  const quickActions = [
    {
      title: 'Add Product',
      icon: <Ionicons name="add-circle" size={32} color="#5B3CC4" />,
      onPress: () => router.push('/add-product'),
    },
    {
      title: 'Create Order',
      icon: <FontAwesome5 name="shopping-basket" size={28} color="#5B3CC4" />,
      onPress: () => router.push('/create-order'),
    },
    {
      title: 'AI Assistant',
      icon: <MaterialCommunityIcons name="robot" size={30} color="#5B3CC4" />,
      onPress: () => router.push('/ai-assistant'),
      highlight: true,
    },
    {
      title: 'Generate Receipt',
      icon: <MaterialCommunityIcons name="file-document-outline" size={30} color="#5B3CC4" />,
      onPress: () => router.push('/generate-receipt'),
    },
    {
      title: 'View Receipt',
      icon: <Ionicons name="document-text" size={30} color="#5B3CC4" />,
      onPress: () => router.push('/view-receipt'),
    },
    {
      title: 'Order History',
      icon: <Entypo name="back-in-time" size={28} color="#5B3CC4" />,
      onPress: () => router.push('/order-history'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
      <ScrollView style={styles.container}>
        <View style={styles.greetingContainer}>
          <View>
            <Text style={styles.greetingText}>Hello, {userProfile?.ownerName || 'Vendor'} 👋</Text>
            <Text style={styles.greetingSubtext}>{userProfile?.businessName || 'Your Business'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Image
              source={{ uri: 'https://img.icons8.com/color/96/shop.png' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {lowStockCount > 0 && (
          <View style={styles.alertContainer}>
            <Ionicons name="warning" size={20} color="#FF6B35" />
            <Text style={styles.alertText}>
              {lowStockCount} product{lowStockCount > 1 ? 's' : ''} running low on stock!
            </Text>
            <TouchableOpacity onPress={() => router.push('/ai-assistant')}>
              <Text style={styles.alertAction}>Ask AI</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.overviewCardGroup}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Orders</Text>
              <Text style={styles.summaryValue}>{todaysOrders.length}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Sales</Text>
              <Text style={styles.summaryValue}>₦{todaysSales.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Products</Text>
              <Text style={styles.summaryValue}>{products.length}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.subtext}>Quick Actions</Text>

        <View style={styles.actionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.actionCard,
                action.highlight && styles.highlightedCard
              ]} 
              onPress={action.onPress}
            >
              {action.icon}
              <Text style={[
                styles.cardText,
                action.highlight && styles.highlightedText
              ]}>
                {action.title}
              </Text>
              {action.highlight && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>AI</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9FF', paddingHorizontal: 16, paddingTop: 20 },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: { fontSize: 22, fontWeight: '700', color: '#333' },
  greetingSubtext: { fontSize: 14, color: '#5B3CC4', marginTop: 4, fontWeight: '500' },
  profileImage: { width: 44, height: 44, borderRadius: 22 },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: '#FF6B35',
    marginLeft: 8,
    fontWeight: '500',
  },
  alertAction: {
    fontSize: 14,
    color: '#5B3CC4',
    fontWeight: '600',
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  subtext: { fontSize: 16, color: '#777', marginBottom: 20 },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
    position: 'relative',
  },
  highlightedCard: {
    backgroundColor: '#F0EDFF',
    borderWidth: 2,
    borderColor: '#5B3CC4',
  },
  cardText: {
    marginTop: 10,
    fontWeight: '600',
    color: '#5B3CC4',
    fontSize: 15,
    textAlign: 'center',
  },
  highlightedText: {
    color: '#5B3CC4',
    fontWeight: '700',
  },
  newBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  overviewSection: {
    marginTop: 0,
    marginBottom: 24,
  },
  overviewCardGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#5B3CC4',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
