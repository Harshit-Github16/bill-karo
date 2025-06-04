import { SubscriptionProvider } from '../context/SubscriptionContext';
import { AuthProvider } from '../context/AuthContext';
import { SessionProvider } from 'next-auth/react';
import MainLayout from '../components/MainLayout';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <SessionProvider session={session}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </SessionProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
