export const debugAuth = (context, user, isAuthenticated, isLoading) => {
  console.log('🔍 AUTH DEBUG:', {
    context,
    user: user ? { id: user.id, name: user.ownerName } : null,
    isAuthenticated,
    isLoading,
    timestamp: new Date().toISOString()
  });
};

export const debugNavigation = (from, to, segments, reason) => {
  console.log('🧭 NAVIGATION DEBUG:', {
    from,
    to,
    segments,
    reason,
    timestamp: new Date().toISOString()
  });
};

export const debugBiometric = (supported, result, error) => {
  console.log('👆 BIOMETRIC DEBUG:', {
    supported,
    result,
    error: error?.message || null,
    timestamp: new Date().toISOString()
  });
};