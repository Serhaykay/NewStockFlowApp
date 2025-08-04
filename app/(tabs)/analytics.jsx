// app/(tabs)/inventory.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Picker,
} from 'react-native';
import { useProductContext } from '../../context/ProductContext';

export default function InventoryScreen() {
  const { products } = useProductContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('nameAsc');

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'stockAsc':
          return a.stock - b.stock;
        case 'stockDesc':
          return b.stock - a.stock;
        case 'dateNew':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'dateOld':
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        default:
          return 0;
      }
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>

      <TextInput
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(value) => setSortBy(value)}
        >
          <Picker.Item label="Name (A–Z)" value="nameAsc" />
          <Picker.Item label="Name (Z–A)" value="nameDesc" />
          <Picker.Item label="Price (Low–High)" value="priceAsc" />
          <Picker.Item label="Price (High–Low)" value="priceDesc" />
          <Picker.Item label="Stock (Low–High)" value="stockAsc" />
          <Picker.Item label="Stock (High–Low)" value="stockDesc" />
          <Picker.Item label="Newest First" value="dateNew" />
          <Picker.Item label="Oldest First" value="dateOld" />
        </Picker>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSub}>₦{item.price} | Stock: {item.stock}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9FF', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#555',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemSub: {
    fontSize: 14,
    color: '#777',
  },
});
