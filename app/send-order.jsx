// app/send-order.jsx
import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SendOrderScreen() {
  const handleSend = () => {
    Alert.alert('Order Sent', 'The order has been shared via WhatsApp.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
    <View style={styles.container}>
      <Text style={styles.title}>Send Order via WhatsApp</Text>
      <TextInput
        placeholder="Customer's WhatsApp Number"
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Order Details"
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 100 }]}
      />
      <Button title="Send Order" onPress={handleSend} color="#5B3CC4" />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
});