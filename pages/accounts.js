import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const AccountsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Accounts</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Your accounts information will be displayed here.</p>
      </div>
    </div>
  );
};

export default AccountsPage; 