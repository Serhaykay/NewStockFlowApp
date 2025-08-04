
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, customersData] = await Promise.all([
        AsyncStorage.getItem('orders'),
        AsyncStorage.getItem('customers')
      ]);

      if (ordersData) setOrders(JSON.parse(ordersData));
      if (customersData) setCustomers(JSON.parse(customersData));
    } catch (error) {
      console.error('Error loading order data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOrders = async (ordersToSave) => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(ordersToSave));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  const saveCustomers = async (customersToSave) => {
    try {
      await AsyncStorage.setItem('customers', JSON.stringify(customersToSave));
    } catch (error) {
      console.error('Error saving customers:', error);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const newOrder = {
        id: Date.now().toString(),
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      await saveOrders(updatedOrders);

      // Add or update customer
      if (orderData.customerName && orderData.customerPhone) {
        await addOrUpdateCustomer({
          name: orderData.customerName,
          phone: orderData.customerPhone,
          email: orderData.customerEmail || '',
        });
      }

      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrder = async (orderId, updatedData) => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === orderId
          ? { ...order, ...updatedData, updatedAt: new Date().toISOString() }
          : order
      );
      setOrders(updatedOrders);
      await saveOrders(updatedOrders);
      return updatedOrders.find(o => o.id === orderId);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      await saveOrders(updatedOrders);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  };

  const addOrUpdateCustomer = async (customerData) => {
    try {
      const existingCustomerIndex = customers.findIndex(
        c => c.phone === customerData.phone
      );

      let updatedCustomers;
      if (existingCustomerIndex !== -1) {
        updatedCustomers = [...customers];
        updatedCustomers[existingCustomerIndex] = {
          ...updatedCustomers[existingCustomerIndex],
          ...customerData,
          lastOrderDate: new Date().toISOString(),
        };
      } else {
        const newCustomer = {
          id: Date.now().toString(),
          ...customerData,
          createdAt: new Date().toISOString(),
          lastOrderDate: new Date().toISOString(),
        };
        updatedCustomers = [...customers, newCustomer];
      }

      setCustomers(updatedCustomers);
      await saveCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error adding/updating customer:', error);
      throw error;
    }
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const getOrdersByDateRange = (startDate, endDate) => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const getTotalSales = () => {
    return orders.reduce((total, order) => total + (order.total || 0), 0);
  };

  const getCustomerOrders = (customerId) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const value = {
    orders,
    customers,
    loading,
    createOrder,
    updateOrder,
    deleteOrder,
    addOrUpdateCustomer,
    getOrdersByStatus,
    getOrdersByDateRange,
    getTotalSales,
    getCustomerOrders,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};
