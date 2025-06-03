import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import DashboardLayout from '../../components/DashboardLayout';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const stats = [
  {
    title: 'Total Balance',
    value: '₹2,81,250',
    change: '+₹12,500',
    changeType: 'increase',
    duration: 'since last month'
  },
  {
    title: 'Total Expenses',
    value: '₹48,250',
    change: '-₹3,200',
    changeType: 'decrease',
    duration: 'since last month'
  },
  {
    title: 'Total Income',
    value: '₹1,25,000',
    change: '+₹15,000',
    changeType: 'increase',
    duration: 'since last month'
  },
  {
    title: 'Active Orders',
    value: '23',
    change: '+5',
    changeType: 'increase',
    duration: 'since last week'
  }
];

const recentTransactions = [
  {
    id: 1,
    description: 'Office Supplies Purchase',
    amount: '₹2,500',
    type: 'expense',
    date: '2024-03-15',
    status: 'completed'
  },
  {
    id: 2,
    description: 'Client Payment - ABC Corp',
    amount: '₹45,000',
    type: 'income',
    date: '2024-03-14',
    status: 'completed'
  },
  {
    id: 3,
    description: 'Utility Bills',
    amount: '₹3,750',
    type: 'expense',
    date: '2024-03-14',
    status: 'pending'
  },
  {
    id: 4,
    description: 'Freelance Project Payment',
    amount: '₹25,000',
    type: 'income',
    date: '2024-03-13',
    status: 'completed'
  },
  {
    id: 5,
    description: 'Marketing Expenses',
    amount: '₹12,000',
    type: 'expense',
    date: '2024-03-13',
    status: 'completed'
  }
];

const activityFeed = [
  {
    id: 1,
    description: 'New order received from Rahul Sharma',
    timestamp: '2 hours ago',
    type: 'order'
  },
  {
    id: 2,
    description: 'Payment received for Invoice #INV-2024-001',
    timestamp: '4 hours ago',
    type: 'payment'
  },
  {
    id: 3,
    description: 'New expense recorded for Office Supplies',
    timestamp: '5 hours ago',
    type: 'expense'
  },
  {
    id: 4,
    description: 'Bank account balance updated',
    timestamp: '1 day ago',
    type: 'update'
  },
  {
    id: 5,
    description: 'Monthly financial report generated',
    timestamp: '1 day ago',
    type: 'report'
  }
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.replace('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Dummy data for expenses over time
  const expenseData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: [3000, 2500, 4000, 3500, 5000, 4500],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  // Dummy data for expense categories
  const categoryData = {
    labels: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'],
    datasets: [
      {
        data: [30, 20, 25, 15, 10],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  // Dummy data for income vs expense
  const comparisonData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [6000, 5500, 7000, 6500, 8000, 7500],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Expenses',
        data: [3000, 2500, 4000, 3500, 5000, 4500],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-2xl font-semibold">Welcome back, Demo User! 👋</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your finances today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Balance Card */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-[#0284C7] rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Total Balance</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">₹24,500</p>
              <span className="ml-2 text-sm text-green-600">+4.75%</span>
            </div>
          </div>

          {/* Total Expenses Card */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-[#0284C7] rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Total Expenses</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">₹8,320</p>
              <span className="ml-2 text-sm text-red-600">-3.2%</span>
            </div>
          </div>

          {/* Total Savings Card */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-[#0284C7] rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Total Savings</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">₹16,180</p>
              <span className="ml-2 text-sm text-green-600">+12.5%</span>
            </div>
          </div>

          {/* Monthly Growth Card */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-[#0284C7] rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Monthly Growth</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">+₹2,300</p>
              <span className="ml-2 text-sm text-green-600">+18.3%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="text-gray-600">
            No recent activity to show.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 