
import React, { createContext, useContext, useState } from 'react';
import { useProductContext } from './ProductContext';
import { useOrderContext } from './OrderContext';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { products, getLowStockProducts, getTotalValue } = useProductContext();
  const { orders, getTotalSales } = useOrderContext();

  const askAI = async (question) => {
    setIsProcessing(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const lowercaseQuestion = question.toLowerCase();
      
      // Generate contextual responses based on business data
      if (lowercaseQuestion.includes('low stock') || lowercaseQuestion.includes('inventory')) {
        const lowStockItems = getLowStockProducts();
        if (lowStockItems.length > 0) {
          return `📦 You have ${lowStockItems.length} items with low stock:\n${lowStockItems.map(item => `• ${item.name} (${item.stock} left)`).join('\n')}\n\nConsider restocking these items soon!`;
        } else {
          return `✅ Great news! All your products are well-stocked. Your inventory levels look healthy.`;
        }
      }
      
      if (lowercaseQuestion.includes('sales') || lowercaseQuestion.includes('revenue')) {
        const totalSales = getTotalSales();
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
        
        return `📊 Sales Summary:\n• Total Revenue: ₦${totalSales.toLocaleString()}\n• Total Orders: ${totalOrders}\n• Average Order Value: ₦${avgOrderValue.toFixed(0)}\n\n${totalSales > 10000 ? 'Excellent performance! 🎉' : 'Keep growing your business! 💪'}`;
      }
      
      if (lowercaseQuestion.includes('product') || lowercaseQuestion.includes('item')) {
        const totalProducts = products.length;
        const totalValue = getTotalValue();
        const categories = [...new Set(products.map(p => p.category))];
        
        return `📋 Inventory Overview:\n• Total Products: ${totalProducts}\n• Total Inventory Value: ₦${totalValue.toLocaleString()}\n• Categories: ${categories.join(', ')}\n\nYour inventory is ${totalProducts > 50 ? 'extensive' : 'growing'}!`;
      }
      
      if (lowercaseQuestion.includes('recommendation') || lowercaseQuestion.includes('suggest')) {
        const recommendations = [
          '💡 Consider setting up automatic low-stock alerts',
          '📱 Use WhatsApp integration to share receipts with customers',
          '📊 Review your analytics weekly to identify trends',
          '🎯 Focus on your best-selling products for promotions',
          '📋 Keep product information updated for better tracking'
        ];
        
        return `Here are some recommendations for your business:\n\n${recommendations.join('\n')}\n\nImplementing these can help boost your sales and efficiency!`;
      }
      
      if (lowercaseQuestion.includes('help') || lowercaseQuestion.includes('how')) {
        return `🤖 I'm here to help! I can assist you with:\n\n• Inventory analysis and alerts\n• Sales performance insights\n• Business recommendations\n• Stock management tips\n• Analytics interpretation\n\nJust ask me about your inventory, sales, or any business questions!`;
      }
      
      // Default response with business insights
      const insights = [];
      if (products.length === 0) {
        insights.push('Start by adding some products to your inventory');
      } else if (getLowStockProducts().length > 0) {
        insights.push(`${getLowStockProducts().length} items need restocking`);
      }
      
      if (orders.length === 0) {
        insights.push('Create your first order to start tracking sales');
      }
      
      const defaultResponse = insights.length > 0 
        ? `💼 Quick Business Insight:\n${insights.join('\n')}\n\nAsk me about inventory, sales, or business recommendations!`
        : `🤖 I'm your AI business assistant! I can help with inventory management, sales analysis, and business insights. What would you like to know about your business?`;
      
      return defaultResponse;
      
    } catch (error) {
      console.error('AI processing error:', error);
      return '❌ Sorry, I encountered an error processing your request. Please try again.';
    } finally {
      setIsProcessing(false);
    }
  };

  const getBusinessInsights = () => {
    const insights = [];
    
    // Stock insights
    const lowStockItems = getLowStockProducts();
    if (lowStockItems.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${lowStockItems.length} items need restocking`,
        action: 'View Inventory'
      });
    }
    
    // Sales insights
    const totalSales = getTotalSales();
    if (totalSales > 0) {
      insights.push({
        type: 'success',
        title: 'Sales Performance',
        message: `Total revenue: ₦${totalSales.toLocaleString()}`,
        action: 'View Analytics'
      });
    }
    
    // Growth suggestions
    if (products.length > 0 && orders.length > 0) {
      insights.push({
        type: 'info',
        title: 'Growth Opportunity',
        message: 'Consider expanding your product categories',
        action: 'Add Products'
      });
    }
    
    return insights;
  };

  const value = {
    askAI,
    isProcessing,
    getBusinessInsights,
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
