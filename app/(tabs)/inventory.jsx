// app/inventory.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { useProductContext } from '../../context/ProductContext'; // Adjust the import path as needed
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InventoryScreen() {
  const { products } = useProductContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>₦{item.price} • Stock: {item.stock}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
    <View style={styles.container}>
      <Text style={styles.header}>Your Inventory</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholderTextColor="#aaa"
      />

      {filteredProducts.length === 0 ? (
        <Text style={styles.noData}>No matching products found.</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9FF', padding: 16 },
  header: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 12 },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    color: '#333',
    elevation: 2,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B3CC4',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  noData: {
    marginTop: 40,
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
  },
});
