import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import DashboardLayout from '../../components/DashboardLayout'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const monthlyData = [
  { month: 'Jan', income: 125000, expenses: 82000, cashFlow: 43000 },
  { month: 'Feb', income: 138000, expenses: 85000, cashFlow: 53000 },
  { month: 'Mar', income: 142000, expenses: 88000, cashFlow: 54000 },
  { month: 'Apr', income: 156000, expenses: 92000, cashFlow: 64000 },
  { month: 'May', income: 165000, expenses: 95000, cashFlow: 70000 },
  { month: 'Jun', income: 178000, expenses: 98000, cashFlow: 80000 },
];

const cashFlowCategories = [
  { category: 'Operating Activities', amount: 80000 },
  { category: 'Investing Activities', amount: -15000 },
  { category: 'Financing Activities', amount: -5000 },
];

export default function CashFlow() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('This Month')
  
  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">
    <div className="h-10 w-10 animate-spin border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
  
  if (!session) {
    router.replace('/login')
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cash Flow Management</h2>
            <p className="text-sm text-gray-500 mt-1">Monitor your cash inflows and outflows</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Download Report
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Net Cash Flow</h3>
            <p className="text-xl font-semibold mt-1">₹80,000</p>
            <span className="text-green-500 text-sm">+14.3% from last month</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Total Income</h3>
            <p className="text-xl font-semibold mt-1">₹178,000</p>
            <span className="text-green-500 text-sm">+7.9% from last month</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Total Expenses</h3>
            <p className="text-xl font-semibold mt-1">₹98,000</p>
            <span className="text-red-500 text-sm">+3.2% from last month</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Cash Ratio</h3>
            <p className="text-xl font-semibold mt-1">1.82</p>
            <span className="text-green-500 text-sm">Healthy</span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-base font-semibold mb-4">Cash Flow Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="income" name="Income" stackId="1" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stackId="2" stroke="#FF8042" fill="#FF8042" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-base font-semibold mb-4">Net Cash Flow Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cashFlow" name="Net Cash Flow" stroke="#00C49F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow Statement */}
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Cash Flow Statement</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="space-y-6">
            {cashFlowCategories.map((category, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{category.category}</h4>
                  <span className={`font-semibold ${category.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {category.amount >= 0 ? '+' : ''}₹{Math.abs(category.amount).toLocaleString()}
                  </span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full">
                  <div
                    className={`h-full rounded-full ${category.amount >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(category.amount) / 1000, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="text-base font-semibold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { date: '2024-06-15', desc: 'Client Payment', category: 'Operating', type: 'Income', amount: 25000 },
                  { date: '2024-06-14', desc: 'Office Rent', category: 'Operating', type: 'Expense', amount: -15000 },
                  { date: '2024-06-13', desc: 'Equipment Purchase', category: 'Investing', type: 'Expense', amount: -8000 },
                ].map((tx, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-sm">{tx.date}</td>
                    <td className="px-4 py-2 text-sm">{tx.desc}</td>
                    <td className="px-4 py-2 text-sm">{tx.category}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tx.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-4 py-2 text-sm font-medium ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount >= 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 