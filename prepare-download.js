
const fs = require('fs');
const path = require('path');

// Create a clean package.json for distribution
const packageJson = {
  "name": "stockflow-app",
  "version": "1.0.0",
  "description": "Smart Inventory Management App for Small Businesses",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build": "expo build",
    "eject": "expo eject"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "2.1.2",
    "@react-native-picker/picker": "^2.11.1",
    "@react-navigation/bottom-tabs": "^7.3.10",
    "@react-navigation/native": "^7.1.6",
    "expo": "53.0.20",
    "expo-constants": "~17.1.6",
    "expo-linking": "~7.1.7",
    "expo-local-authentication": "^16.0.5",
    "expo-media-library": "~17.1.7",
    "expo-router": "~5.1.4",
    "expo-secure-store": "^14.2.3",
    "expo-sharing": "~13.1.5",
    "expo-status-bar": "~2.2.3",
    "react": "19.0.0",
    "react-native": "0.79.5",
    "react-native-chart-kit": "^6.12.0",
    "react-native-gesture-handler": "~2.24.0",
    "react-native-reanimated": "~3.17.4",
    "react-native-safe-area-context": "^5.4.0",
    "react-native-screens": "~4.11.1",
    "react-native-share": "^12.1.2",
    "react-native-svg": "15.11.2",
    "react-native-vector-icons": "^10.2.0",
    "react-native-view-shot": "^4.0.3"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true,
  "keywords": ["react-native", "expo", "inventory", "management", "business"],
  "author": "Your Name",
  "license": "MIT"
};

// Write the clean package.json
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log('✅ Package.json cleaned and prepared for download');
console.log('📦 Your StockFlow app is ready for distribution!');
console.log('\n📋 Setup Instructions:');
console.log('1. Clone/Download the repository');
console.log('2. Run: npm install');
console.log('3. Run: npm start');
console.log('4. Scan QR code with Expo Go app');
console.log('\n🔒 Security Features Included:');
console.log('• Biometric authentication');
console.log('• Secure data storage');
console.log('• Subscription management');
console.log('• Data encryption');
console.log('\n💰 Subscription: ₦500/month after 30-day free trial');
