
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { captureRef } from 'react-native-view-shot';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useProductContext } from '../context/ProductContext';

export default function GenerateReceiptScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const receiptRef = useRef();
  const { userProfile } = useAuth();
  const { orders } = useProductContext();
  const [isSharing, setIsSharing] = useState(false);

  // Get the latest order or use params
  const order = orders[orders.length - 1] || {
    id: 'SAMPLE',
    customerName: 'Sample Customer',
    customerPhone: '+234812345678',
    date: new Date().toISOString(),
    total: 5500,
    items: [
      { name: 'Sample Product', quantity: 2, price: 2000 },
      { name: 'Another Item', quantity: 1, price: 1500 },
    ],
  };

  const handleShareToWhatsApp = async () => {
    setIsSharing(true);
    try {
      const receiptText = generateReceiptText(order);
      const whatsappUrl = `whatsapp://send?phone=${order.customerPhone}&text=${encodeURIComponent(receiptText)}`;
      
      // Try to open WhatsApp
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback to regular share
        await Share.share({
          message: receiptText,
          title: 'Receipt from StockFlow',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share receipt. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const generateReceiptText = (order) => {
    const business = userProfile?.businessName || 'StockFlow Business';
    const phone = userProfile?.phone || '';
    const address = userProfile?.address || '';
    
    let receiptText = `📋 *RECEIPT*\n`;
    receiptText += `${business}\n`;
    if (phone) receiptText += `📞 ${phone}\n`;
    if (address) receiptText += `📍 ${address}\n`;
    receiptText += `\n━━━━━━━━━━━━━━━━━━━\n`;
    receiptText += `Receipt #: ${order.id}\n`;
    receiptText += `Date: ${new Date(order.date).toLocaleDateString()}\n`;
    receiptText += `Customer: ${order.customerName}\n`;
    receiptText += `\n*ITEMS:*\n`;
    
    order.items.forEach(item => {
      receiptText += `${item.name}\n`;
      receiptText += `  ${item.quantity} x ₦${item.price} = ₦${item.quantity * item.price}\n`;
    });
    
    receiptText += `\n━━━━━━━━━━━━━━━━━━━\n`;
    receiptText += `*TOTAL: ₦${order.total}*\n`;
    receiptText += `\nThank you for your business! 🙏\n`;
    receiptText += `Powered by StockFlow 📱`;
    
    return receiptText;
  };

  const handleSaveReceipt = async () => {
    try {
      const uri = await captureRef(receiptRef, {
        format: 'png',
        quality: 1,
      });

      await Share.share({
        url: uri,
        message: 'Receipt from StockFlow',
        title: 'StockFlow Receipt',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to save receipt. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#5B3CC4" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Receipt</Text>
          <View style={{ width: 24 }} />
        </View>

        <View ref={receiptRef} style={styles.receiptContainer}>
          <View style={styles.businessHeader}>
            <Text style={styles.businessName}>{userProfile?.businessName || 'StockFlow Business'}</Text>
            {userProfile?.phone && <Text style={styles.businessInfo}>📞 {userProfile.phone}</Text>}
            {userProfile?.address && <Text style={styles.businessInfo}>📍 {userProfile.address}</Text>}
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Receipt #:</Text>
              <Text style={styles.detailValue}>{order.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{new Date(order.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>{new Date(order.date).toLocaleTimeString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Customer:</Text>
              <Text style={styles.detailValue}>{order.customerName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.itemsSection}>
            <Text style={styles.itemsHeader}>ITEMS</Text>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>{item.quantity} x ₦{item.price}</Text>
                </View>
                <Text style={styles.itemTotal}>₦{item.quantity * item.price}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
            <Text style={styles.totalAmount}>₦{order.total}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.thankYou}>Thank you for your business! 🙏</Text>
            <Text style={styles.poweredBy}>Powered by StockFlow</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.whatsappButton]}
            onPress={handleShareToWhatsApp}
            disabled={isSharing}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>
              {isSharing ? 'Sharing...' : 'Share to WhatsApp'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSaveReceipt}
          >
            <Ionicons name="download" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Save Receipt</Text>
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
    justifyContent: 'space-between',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B3CC4',
  },
  receiptContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  businessHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  businessName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B3CC4',
    marginBottom: 8,
  },
  businessInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  receiptDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  itemsSection: {
    marginBottom: 10,
  },
  itemsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  totalSection: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5B3CC4',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  thankYou: {
    fontSize: 16,
    color: '#5B3CC4',
    fontWeight: '500',
    marginBottom: 4,
  },
  poweredBy: {
    fontSize: 12,
    color: '#999',
  },
  actionButtons: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  saveButton: {
    backgroundColor: '#5B3CC4',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
