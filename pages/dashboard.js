import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.replace('/login');
    }
  }, [session, status, router]);

  // If the session is loading, show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If no session exists, don't render anything (will redirect)
  if (!session) {
    return null;
  }

  // Render dashboard content for authenticated users
  return (
    <>
      <Head>
        <title>Dashboard - BillKaro</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            {/* Add more dashboard components here */}
          </div>
        </main>
      </div>
    </>
  );
} 