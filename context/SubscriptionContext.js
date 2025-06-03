import { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false);

  const value = {
    isPremium,
    setIsPremium,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
} 