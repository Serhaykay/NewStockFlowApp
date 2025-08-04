
// Security Configuration for StockFlow App

export const SECURITY_CONFIG = {
  // Subscription settings
  SUBSCRIPTION: {
    TRIAL_PERIOD_DAYS: 30,
    MONTHLY_PRICE: 500,
    CURRENCY: 'NGN',
    GRACE_PERIOD_DAYS: 3,
  },

  // Authentication settings
  AUTH: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 15,
    SESSION_TIMEOUT_HOURS: 24,
    BIOMETRIC_PROMPT_MESSAGE: 'Authenticate to access StockFlow',
  },

  // Data encryption settings
  ENCRYPTION: {
    ALGORITHM: 'AES-256-GCM',
    KEY_DERIVATION: 'PBKDF2',
    ITERATIONS: 100000,
  },

  // API security (for future backend integration)
  API: {
    TIMEOUT_MS: 30000,
    MAX_RETRIES: 3,
    RATE_LIMIT_REQUESTS: 100,
    RATE_LIMIT_WINDOW_MINUTES: 15,
  },

  // Data validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_FILE_SIZE_MB: 10,
    ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png'],
    MAX_PRODUCT_NAME_LENGTH: 100,
    MAX_BUSINESS_NAME_LENGTH: 100,
  },

  // Feature flags
  FEATURES: {
    BIOMETRIC_AUTH: true,
    OFFLINE_MODE: true,
    DATA_EXPORT: true,
    ANALYTICS: true,
    AI_ASSISTANT: true,
    WHATSAPP_INTEGRATION: true,
  }
};

// Security utility functions
export const SecurityUtils = {
  // Generate secure random ID
  generateSecureId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Validate input data
  validateInput: (input, type) => {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      case 'phone':
        return /^\+?[\d\s-()]+$/.test(input);
      case 'price':
        return /^\d+(\.\d{1,2})?$/.test(input);
      default:
        return input && input.trim().length > 0;
    }
  },

  // Sanitize user input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
  },

  // Check subscription status
  isSubscriptionValid: (subscription) => {
    if (!subscription) return false;
    
    const now = new Date();
    const trialEnd = new Date(subscription.trialEndDate);
    const subscriptionEnd = new Date(subscription.subscriptionEndDate);
    
    return subscription.status === 'trial' && now <= trialEnd ||
           subscription.status === 'active' && now <= subscriptionEnd;
  }
};
