// app/order-history.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useOrderContext } from '../context/OrderContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; // ✅ correct


export default function OrderHistoryScreen() {
  const { orders } = useOrderContext();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');
  const router = useRouter();

  const filteredOrders = orders
    .filter((order) =>
      order.customerName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateDesc':
          return new Date(b.date) - new Date(a.date);
        case 'dateAsc':
          return new Date(a.date) - new Date(b.date);
        case 'totalHigh':
          return b.total - a.total;
        case 'totalLow':
          return a.total - b.total;
        default:
          return 0;
      }
    });

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>Order #{item.id}</Text>
      <Text style={styles.orderSub}>Customer: {item.customerName}</Text>
      <Text style={styles.orderSub}>Date: {item.date}</Text>
      <Text style={styles.orderSub}>Total: ₦{item.total}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/dashboard')}>
          <Ionicons name="arrow-back" size={28} color="#5B3CC4" />
        </TouchableOpacity>
        <Text style={styles.title}>Order History</Text>
      </View>

      <TextInput
        placeholder="Search by customer..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <View style={styles.filterBox}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <Picker
          selectedValue={sortBy}
          onValueChange={(val) => setSortBy(val)}
          style={styles.picker}
        >
          <Picker.Item label="Date (Newest First)" value="dateDesc" />
          <Picker.Item label="Date (Oldest First)" value="dateAsc" />
          <Picker.Item label="Total (High → Low)" value="totalHigh" />
          <Picker.Item label="Total (Low → High)" value="totalLow" />
        </Picker>
      </View>

      {filteredOrders.length === 0 ? (
        <Text style={styles.noData}>No orders found.</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9FF', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#333' },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  filterBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#555' },
  picker: { height: 40, width: '100%' },
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    elevation: 2,
  },
  orderTitle: { fontSize: 16, fontWeight: '600', color: '#5B3CC4' },
  orderSub: { fontSize: 14, color: '#555' },
  noData: { textAlign: 'center', marginTop: 40, color: '#999' },
});
