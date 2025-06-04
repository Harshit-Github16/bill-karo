import { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  CurrencyRupeeIcon, DocumentTextIcon, ChartBarIcon, 
  ArrowTrendingUpIcon, ExclamationCircleIcon, CheckCircleIcon 
} from '@heroicons/react/24/outline';

// Sample data - Replace with real data from your API
const monthlyRevenue = [
  { month: 'Jan', amount: 125000 },
  { month: 'Feb', amount: 165000 },
  { month: 'Mar', amount: 145000 },
  { month: 'Apr', amount: 185000 },
  { month: 'May', amount: 155000 },
  { month: 'Jun', amount: 190000 },
];

const gstData = [
  { name: 'CGST', value: 25000 },
  { name: 'SGST', value: 25000 },
  { name: 'IGST', value: 35000 },
];

const recentInvoices = [
  { id: 'INV001', customer: 'Tech Solutions Ltd', amount: 45000, status: 'PAID', date: '2024-03-15' },
  { id: 'INV002', customer: 'Global Traders', amount: 32000, status: 'PENDING', date: '2024-03-14' },
  { id: 'INV003', customer: 'Innovative Systems', amount: 28000, status: 'PAID', date: '2024-03-13' },
  { id: 'INV004', customer: 'Prime Industries', amount: 56000, status: 'OVERDUE', date: '2024-03-10' },
  { id: 'INV005', customer: 'Digital Services', amount: 41000, status: 'PAID', date: '2024-03-09' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className={`mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard - BillKaro</title>
      </Head>

      <div className="py-4">
        <div className="px-4">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <div className="px-4">
          {/* Stats Grid */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value="₹9,65,000"
              icon={CurrencyRupeeIcon}
              trend={12.5}
              color="bg-blue-500"
            />
            <StatCard
              title="Total Invoices"
              value="142"
              icon={DocumentTextIcon}
              trend={8.2}
              color="bg-green-500"
            />
            <StatCard
              title="Pending Amount"
              value="₹1,25,000"
              icon={ExclamationCircleIcon}
              trend={-5.1}
              color="bg-yellow-500"
            />
            <StatCard
              title="GST Collected"
              value="₹85,000"
              icon={ChartBarIcon}
              trend={15.3}
              color="bg-purple-500"
            />
          </div>

          {/* Charts Grid */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Revenue Overview</h2>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="month">Last 6 Months</option>
                  <option value="quarter">Last 4 Quarters</option>
                  <option value="year">Last 2 Years</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" name="Revenue" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* GST Distribution */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">GST Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gstData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gstData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Invoices Table */}
          <div className="mt-4 bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                        {invoice.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {invoice.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        ₹{invoice.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 