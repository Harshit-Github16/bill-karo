import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Logo from '../components/Logo';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        username: 'demo123',
        password: 'demo123',
        redirect: false
      });

      if (!result?.error) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Login - BillKaro</title>
      </Head>
      <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-indigo-100 to-white py-12 px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo size="large" className="mb-5" />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Welcome to BillKaro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your complete financial management solution
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
            <form onSubmit={handleDemoLogin} className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login with Demo Account'}
              </button>
            </form>

            <div className="mt-4 text-sm text-center text-gray-600">
              Click above to explore all features instantly
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 