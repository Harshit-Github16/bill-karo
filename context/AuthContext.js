import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Demo premium user data
const demoUser = {
  email: 'demo@billkaro.com',
  name: 'Demo User',
  company: 'BillKaro Demo Ltd',
  isPremium: true,
  gstNumber: '27AAAAA0000A1Z5',
  address: {
    street: '123 Business Hub',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(demoUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // For demo, we'll always log in as the demo user
      setUser(demoUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 