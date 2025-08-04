
# 📱 StockFlow - Smart Inventory Management

StockFlow is a comprehensive inventory and order management app designed for small vendors and retailers. Built with React Native + Expo Router, it features secure authentication, subscription management, AI insights, and seamless business operations.

## ✨ Features

### 🔐 Security & Authentication
- **Biometric Authentication** - Face ID/Fingerprint login
- **Secure Data Storage** - Encrypted local storage
- **Session Management** - Auto-logout and security timeouts
- **Data Validation** - Input sanitization and validation

### 💰 Subscription Management
- **Free Trial** - 30 days full access
- **Affordable Pricing** - ₦500/month after trial
- **Premium Features** - AI assistant, advanced analytics
- **Subscription Guard** - Automatic feature protection

### 📦 Inventory Management
- **Product CRUD** - Add, update, delete products
- **Stock Tracking** - Real-time inventory levels
- **Low Stock Alerts** - Automatic notifications
- **Category Management** - Organize products efficiently
- **Barcode Support** - Product identification

### 🤖 AI Assistant
- **Smart Insights** - Inventory analysis and recommendations
- **Sales Analytics** - Revenue and performance tracking
- **Business Advice** - Contextual suggestions
- **Natural Language** - Easy conversation interface

### 🧾 Order & Receipt Management
- **Order Creation** - Quick order processing
- **Receipt Generation** - Professional receipt design
- **Customer Management** - Track customer information
- **Order History** - Complete transaction records

### 📱 WhatsApp Integration
- **Receipt Sharing** - Send receipts directly to customers
- **Order Notifications** - WhatsApp order updates
- **Customer Communication** - Seamless messaging

### 📊 Analytics Dashboard
- **Sales Tracking** - Revenue and order metrics
- **Performance Charts** - Visual data representation
- **Trend Analysis** - Business growth insights
- **Custom Reports** - Tailored business reports

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. **Clone or download the repository:**
```bash
git clone https://github.com/yourusername/stockflow-app.git
cd stockflow-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

4. **Run the app:**
   - Scan the QR code with Expo Go (Android)
   - Use Camera app to scan QR code (iOS)

## 📱 App Architecture

```
stockflow-app/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── dashboard.jsx  # Main dashboard
│   │   ├── inventory.jsx  # Inventory management
│   │   └── analytics.jsx  # Business analytics
│   ├── login.jsx          # Authentication screen
│   ├── subscription.jsx   # Subscription management
│   └── ai-assistant.jsx   # AI chat interface
├── context/               # React Context providers
│   ├── AuthContext.js     # Authentication & subscription
│   ├── ProductContext.js  # Product management
│   ├── OrderContext.js    # Order management
│   └── AIContext.js       # AI assistant
├── components/            # Reusable UI components
│   └── SubscriptionGuard.jsx
├── assets/               # Images and static files
└── security-config.js    # Security configuration
```

## 🔒 Security Features

### Authentication
- Biometric login (Face ID/Fingerprint)
- Secure token storage with Expo SecureStore
- Session timeout and auto-logout
- Login attempt limits and lockout

### Data Protection
- Local data encryption
- Input validation and sanitization
- Secure storage for sensitive information
- Data integrity checks

### Subscription Security
- Server-side subscription validation (when backend is integrated)
- Feature access control
- Payment security compliance
- Trial period enforcement

## 💰 Subscription Model

### Free Trial
- **Duration:** 30 days
- **Features:** Full access to all premium features
- **No Credit Card:** Required for trial

### Premium Subscription
- **Price:** ₦500/month
- **Billing:** Monthly recurring
- **Features:** All premium features unlocked
- **Support:** Priority customer support

### Premium Features
- ✅ Unlimited product inventory
- ✅ AI-powered business insights
- ✅ Advanced analytics and reports
- ✅ WhatsApp integration
- ✅ Receipt generation and sharing
- ✅ Customer management
- ✅ Data export and backup

## 🛠️ Configuration

### Environment Setup
The app uses local storage for development. For production:

1. **Subscription Management:**
   - Integrate with payment gateway (Paystack, Flutterwave)
   - Set up webhook endpoints for subscription events
   - Configure subscription validation

2. **Security Hardening:**
   - Enable code obfuscation
   - Implement certificate pinning
   - Add runtime application self-protection (RASP)

3. **Analytics & Monitoring:**
   - Set up crash reporting (Sentry)
   - Configure performance monitoring
   - Add user analytics tracking

## 📊 Deployment

### Expo Managed Workflow
```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios

# Publish updates
expo publish
```

### Production Checklist
- [ ] Configure production API endpoints
- [ ] Set up payment gateway integration
- [ ] Enable analytics and crash reporting
- [ ] Configure push notifications
- [ ] Set up backend authentication
- [ ] Implement data synchronization
- [ ] Test subscription workflows
- [ ] Validate security measures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Guide](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### Contact
- **Email:** support@stockflow.app
- **Website:** https://stockflow.app
- **Issues:** [GitHub Issues](https://github.com/yourusername/stockflow-app/issues)

### Support Channels
- 📧 Email support for billing questions
- 💬 In-app chat for technical support
- 📱 WhatsApp support for urgent issues

## 🎯 Roadmap

### Upcoming Features
- [ ] Multi-store management
- [ ] Inventory forecasting
- [ ] Supplier management
- [ ] Point of sale integration
- [ ] Offline synchronization
- [ ] Advanced reporting
- [ ] Team collaboration
- [ ] API integrations

---

**StockFlow** - Empowering small businesses with smart inventory management 🚀
