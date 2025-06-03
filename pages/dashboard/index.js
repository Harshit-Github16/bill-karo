import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '../../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  BanknotesIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  CurrencyRupeeIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import WelcomeModal from '../../components/WelcomeModal';

const stats = [
  {
    name: 'Total Revenue',
    value: '₹2,45,000',
    change: '+12.5%',
    trend: 'up',
    icon: BanknotesIcon,
  },
  {
    name: 'Total Expenses',
    value: '₹1,75,000',
    change: '+8.2%',
    trend: 'up',
    icon: ArrowTrendingDownIcon,
  },
  {
    name: 'Pending Invoices',
    value: '12',
    change: '-2.4%',
    trend: 'down',
    icon: DocumentTextIcon,
  },
  {
    name: 'Net Profit',
    value: '₹70,000',
    change: '+18.9%',
    trend: 'up',
    icon: ArrowTrendingUpIcon,
  },
];

const revenueData = [
  { month: 'Jan', revenue: 180000, expenses: 120000 },
  { month: 'Feb', revenue: 220000, expenses: 150000 },
  { month: 'Mar', revenue: 245000, expenses: 175000 },
];

const quickActions = [
  {
    name: 'Create Invoice',
    description: 'Generate a new invoice for your clients',
    icon: DocumentDuplicateIcon,
    href: '/dashboard/invoices',
  },
  {
    name: 'Add Expense',
    description: 'Record a new business expense',
    icon: CurrencyRupeeIcon,
    href: '/dashboard/expenses',
  },
  {
    name: 'File GST',
    description: 'Submit your GST returns',
    icon: ReceiptPercentIcon,
    href: '/dashboard/gst',
  },
];

function Stats() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
        >
          <dt>
            <div className="absolute bg-blue-500 rounded-md p-3">
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
          </dt>
          <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.change}
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue vs Expenses</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              name="Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <motion.a
            key={action.name}
            href={action.href}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-lg border border-gray-200 p-6 flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <div className="flex-shrink-0">
              <action.icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-base font-medium text-gray-900">{action.name}</p>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (session?.user?.isFirstLogin) {
      setShowWelcomeModal(true);
      // Update user's isFirstLogin status
      fetch('/api/users/welcome', {
        method: 'POST',
      });
    }
  }, [session]);

  return (
    <DashboardLayout
      title="Dashboard"
      description="Overview of your business finances"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Welcome back! Here's an overview of your business finances
          </p>
        </div>

        <Stats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <QuickActions />
        </div>
      </div>

      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />
    </DashboardLayout>
  );
} 