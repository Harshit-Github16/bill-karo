import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from './Logo';
import {
  HomeIcon,
  BanknotesIcon,
  DocumentChartBarIcon,
  ReceiptRefundIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Accounts', href: '/dashboard/accounts', icon: BanknotesIcon },
  { name: 'Expenses', href: '/dashboard/expenses', icon: ReceiptRefundIcon },
  { name: 'Reports', href: '/dashboard/reports', icon: DocumentChartBarIcon },
  { name: 'Orders', href: '/dashboard/orders', icon: ClipboardDocumentListIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function Layout({ children, meta }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{meta?.title ? `${meta.title} - BillKaro` : 'BillKaro'}</title>
        <meta
          name="description"
          content={meta?.description || 'BillKaro - Financial Management System'}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 px-6 py-6 border-b border-gray-200">
              <Logo size="large" withTagline asLink />
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <button
                onClick={() => router.push('/auth/logout')}
                className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-red-600 hover:bg-red-50"
              >
                <ArrowLeftOnRectangleIcon
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600"
                  aria-hidden="true"
                />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="pl-64">
          <main>{children}</main>
        </div>
      </div>
    </>
  );
} 