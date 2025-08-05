// app/view-receipts.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🧪 Mock Receipts Data
const mockReceipts = [
  {
    id: 'ORD-1001',
    date: '2025-06-19',
    customerName: 'Tunde Balogun',
    total: 7500,
    items: [
      { name: 'Face Cap', quantity: 2, price: 1500 },
      { name: 'Socks', quantity: 3, price: 1500 },
    ],
  },
  {
    id: 'ORD-1002',
    date: '2025-06-20',
    customerName: 'Zainab Musa',
    total: 10500,
    items: [
      { name: 'Canvas', quantity: 1, price: 7500 },
      { name: 'T-Shirt', quantity: 2, price: 1500 },
    ],
  },
];

export default function ViewReceipts() {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const router = useRouter();

  const openReceipt = (order) => setSelectedReceipt(order);
  const closeReceipt = () => setSelectedReceipt(null);

  const renderReceipt = ({ item }) => (
    <TouchableOpacity style={styles.receiptItem} onPress={() => openReceipt(item)}>
      <Text style={styles.receiptTitle}>Order ID: {item.id}</Text>
      <Text style={styles.receiptSub}>Date: {item.date}</Text>
      <Text style={styles.receiptSub}>Total: ₦{item.total.toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/dashboard')}>
          <Ionicons name="arrow-back" size={28} color="#5B3CC4" />
        </TouchableOpacity>
        <Text style={styles.title}>View Receipts</Text>
      </View>

      <FlatList
        data={mockReceipts}
        keyExtractor={(item) => item.id}
        renderItem={renderReceipt}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal visible={!!selectedReceipt} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <View style={styles.modalCard}>
            <ScrollView>
              <Text style={styles.modalTitle}>Receipt</Text>
              <Text style={styles.modalText}>Order ID: {selectedReceipt?.id}</Text>
              <Text style={styles.modalText}>Date: {selectedReceipt?.date}</Text>
              <Text style={styles.modalText}>Customer: {selectedReceipt?.customerName}</Text>
              <Text style={styles.modalText}>Total: ₦{selectedReceipt?.total.toLocaleString()}</Text>
              <Text style={[styles.modalText, { marginTop: 12 }]}>Items:</Text>
              {selectedReceipt?.items?.map((item, index) => (
                <Text key={index} style={styles.modalText}>
                  - {item.name} x{item.quantity} (₦{item.price})
                </Text>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.shareBtn}
                onPress={() => alert('Sharing via WhatsApp coming soon')}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                <Text style={styles.shareText}>Share</Text>
              </Pressable>
              <Pressable onPress={closeReceipt}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9FF', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#333' },
  receiptItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    elevation: 2,
  },
  receiptTitle: { fontSize: 16, fontWeight: '600', color: '#5B3CC4' },
  receiptSub: { fontSize: 14, color: '#555' },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5B3CC4',
    marginBottom: 10,
  },
  modalText: { fontSize: 14, marginBottom: 6, color: '#333' },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  shareBtn: {
    flexDirection: 'row',
    backgroundColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    gap: 6,
  },
  shareText: { color: '#fff', fontWeight: '600' },
  closeText: { color: '#5B3CC4', fontWeight: '600', fontSize: 16 },
});
