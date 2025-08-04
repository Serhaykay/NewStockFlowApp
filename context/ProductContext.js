
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const savedProducts = await AsyncStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProducts = async (productsToSave) => {
    try {
      await AsyncStorage.setItem('products', JSON.stringify(productsToSave));
    } catch (error) {
      console.error('Error saving products:', error);
    }
  };

  const addProduct = async (productData) => {
    try {
      const newProduct = {
        id: Date.now().toString(),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      await saveProducts(updatedProducts);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (productId, updatedData) => {
    try {
      const updatedProducts = products.map(product =>
        product.id === productId
          ? { ...product, ...updatedData, updatedAt: new Date().toISOString() }
          : product
      );
      setProducts(updatedProducts);
      await saveProducts(updatedProducts);
      return updatedProducts.find(p => p.id === productId);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      await saveProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      await updateProduct(productId, { stock: newStock });
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stock <= (product.lowStockAlert || 10));
  };

  const getOutOfStockProducts = () => {
    return products.filter(product => product.stock === 0);
  };

  const searchProducts = (query) => {
    if (!query) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.barcode?.includes(query)
    );
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  };

  const getTotalValue = () => {
    return products.reduce((total, product) => total + (product.price * product.stock), 0);
  };

  const value = {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getLowStockProducts,
    getOutOfStockProducts,
    searchProducts,
    getProductsByCategory,
    getTotalValue,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
