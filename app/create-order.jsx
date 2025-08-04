import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProductContext } from '../context/ProductContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateOrderScreen() {
  const router = useRouter();
  const { products } = useProductContext();

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [orderItems, setOrderItems] = useState([]);

  const addToOrder = () => {
    if (!selectedProductId || !quantity) return;

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const existing = orderItems.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += parseInt(quantity);
      setOrderItems([...orderItems]);
    } else {
      setOrderItems([
        ...orderItems,
        {
          ...product,
          quantity: parseInt(quantity),
        },
      ]);
    }

    setSelectedProductId(null);
    setQuantity('1');
  };

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#5B3CC4" />
          <Text style={styles.backText}>Back to Dashboard</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create Order</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Select Product</Text>
          <View style={styles.dropdown}>
            {products.map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => setSelectedProductId(product.id)}
                style={[
                  styles.option,
                  selectedProductId === product.id && styles.selectedOption,
                ]}
              >
                <Text style={styles.optionText}>{product.name} - ₦{product.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <TouchableOpacity onPress={addToOrder} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add to Order</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subheading}>Order Summary</Text>

        <View style={styles.summaryBox}>
          {orderItems.length === 0 ? (
            <Text style={styles.emptyText}>No items in order</Text>
          ) : (
            <FlatList
              data={orderItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryText}>
                    {item.name} x{item.quantity}
                  </Text>
                  <Text style={styles.summaryPrice}>₦{item.quantity * item.price}</Text>
                </View>
              )}
            />
          )}
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>₦{totalPrice}</Text>
        </View>
        {orderItems.length > 0 && (
  <View style={styles.footerActions}>
    <TouchableOpacity
      style={[styles.footerButton, { backgroundColor: '#25D366' }]}
      onPress={() => router.push('/send-order')}
    >
      <Ionicons name="logo-whatsapp" size={20} color="#fff" />
      <Text style={styles.footerButtonText}>Send Order</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.footerButton, { backgroundColor: '#5B3CC4' }]}
      onPress={() => router.push('/generate-receipt')}
    >
      <Ionicons name="document-text-outline" size={20} color="#fff" />
      <Text style={styles.footerButtonText}>Generate Receipt</Text>
    </TouchableOpacity>
  </View>
)}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    marginLeft: 6,
    color: '#5B3CC4',
    fontWeight: '600',
    fontSize: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontWeight: '600',
    color: '#444',
    marginTop: 10,
    marginBottom: 4,
  },
  dropdown: {
    backgroundColor: '#F1F1F5',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  selectedOption: {
    backgroundColor: '#DCD6FA',
    borderRadius: 6,
  },
  optionText: {
    color: '#333',
  },
  input: {
    backgroundColor: '#F1F1F5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#5B3CC4',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    minHeight: 80,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    padding: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  summaryText: {
    fontSize: 15,
    color: '#333',
  },
  summaryPrice: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 30,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5B3CC4',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  footerActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 10,
  marginBottom: 30,
},
footerButton: {
  flex: 1,
  padding: 14,
  borderRadius: 10,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
footerButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 14,
  marginLeft: 6,
},

});
