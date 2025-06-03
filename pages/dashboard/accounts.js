import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BellIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'BANK',
    balance: 0,
    description: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount),
      });
      
      if (!response.ok) throw new Error('Failed to create account');
      
      await fetchAccounts();
      setShowCreateModal(false);
      setNewAccount({
        name: '',
        type: 'BANK',
        balance: 0,
        description: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculate statistics
  const receivables = accounts.filter(acc => acc.type === 'RECEIVABLE');
  const payables = accounts.filter(acc => acc.type === 'PAYABLE');
  const totalReceivables = receivables.reduce((sum, acc) => sum + acc.balance, 0);
  const totalPayables = payables.reduce((sum, acc) => sum + acc.balance, 0);
  const totalBankBalance = accounts
    .filter(acc => acc.type === 'BANK')
    .reduce((sum, acc) => sum + acc.balance, 0);
  const totalCashBalance = accounts
    .filter(acc => acc.type === 'CASH')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const accountStats = [
    {
      title: 'Bank Balance',
      value: `₹${totalBankBalance.toLocaleString()}`,
      icon: BanknotesIcon,
    },
    {
      title: 'Cash Balance',
      value: `₹${totalCashBalance.toLocaleString()}`,
      icon: BanknotesIcon,
    },
    {
      title: 'Total Receivables',
      value: `₹${totalReceivables.toLocaleString()}`,
      icon: ArrowTrendingUpIcon,
    },
    {
      title: 'Total Payables',
      value: `₹${totalPayables.toLocaleString()}`,
      icon: ArrowTrendingDownIcon,
    },
  ];

  const getAccountTypeColor = (type) => {
    const colors = {
      BANK: 'bg-blue-100 text-blue-800',
      CASH: 'bg-green-100 text-green-800',
      RECEIVABLE: 'bg-yellow-100 text-yellow-800',
      PAYABLE: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return (
    <DashboardLayout title="Accounts" description="Manage accounts and balances">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Accounts" description="Manage accounts and balances">
      <div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track and manage your business accounts and balances
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <BanknotesIcon className="h-5 w-5 mr-2" />
              Add Account
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {accountStats.map((stat) => (
            <div key={stat.title} className="stat-card card-hover">
              <div className="flex items-center justify-between">
                <p className="stat-title">{stat.title}</p>
                <stat.icon className="h-5 w-5 text-gray-400" />
              </div>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Accounts List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts.map((account) => (
                  <tr key={account._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {account.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}>
                        {account.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{account.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(account.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Account Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-lg font-medium mb-4">Add New Account</h2>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    className="input mt-1"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    required
                    className="input mt-1"
                    value={newAccount.type}
                    onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                  >
                    <option value="BANK">Bank</option>
                    <option value="CASH">Cash</option>
                    <option value="RECEIVABLE">Receivable</option>
                    <option value="PAYABLE">Payable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Balance
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="input mt-1"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    className="input mt-1"
                    value={newAccount.description}
                    onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 