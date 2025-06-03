import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import DashboardLayout from '../components/DashboardLayout'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell } from 'recharts'

const stats = [
  { id: 1, name: 'Total Balance', value: '₹24,500', change: '+4.75%', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 10h18v10H3V10zm0-6h18v4H3V4z" /></svg> },
  { id: 2, name: 'Total Expenses', value: '₹8,320', change: '-3.2%', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /></svg> },
  { id: 3, name: 'Total Savings', value: '₹16,180', change: '+12.5%', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg> },
  { id: 4, name: 'GST Balance', value: '₹4,250', change: '+5.2%', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> },
]

const lineData = [
  { month: 'Jan', balance: 15000 },
  { month: 'Feb', balance: 18000 },
  { month: 'Mar', balance: 22000 },
  { month: 'Apr', balance: 24500 },
]

const barData = [
  { name: 'Rent', expense: 3200 },
  { name: 'Food', expense: 1800 },
  { name: 'Transport', expense: 1200 },
  { name: 'Utilities', expense: 1120 },
]

const activityData = [
  { id: 1, desc: 'Sent ₹500 to Rahul', date: '2 Jun' },
  { id: 2, desc: 'Added ₹2000 to savings', date: '1 Jun' },
  { id: 3, desc: 'Paid electricity bill', date: '30 May' },
]

const gstData = [
  { category: 'CGST', amount: 2125 },
  { category: 'SGST', amount: 2125 },
  { category: 'IGST', amount: 0 },
]

const gstTransactions = [
  { id: 1, desc: 'Invoice #INV-001', amount: '₹1,800', gst: '₹324', date: '2 Jun' },
  { id: 2, desc: 'Invoice #INV-002', amount: '₹2,500', gst: '₹450', date: '1 Jun' },
  { id: 3, desc: 'Invoice #INV-003', amount: '₹3,300', gst: '₹594', date: '30 May' },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status !== 'loading' && !session) router.replace('/login')
  }, [session, status])

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><div className="h-10 w-10 animate-spin border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  if (!session) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, Demo User 👋</h2>
          <p className="text-sm text-gray-500 mt-1">Your financial dashboard</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(i => (
            <div key={i.id} className="bg-white p-4 rounded-xl shadow flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-full">{i.icon}</div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{i.name}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-semibold">{i.value}</p>
                  <span className={`text-sm ${i.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{i.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-base font-semibold mb-4 text-gray-800">Balance Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-base font-semibold mb-4 text-gray-800">Expenses Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="expense" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-base font-semibold mb-4 text-gray-800">GST Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={gstData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {gstData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-base font-semibold mb-4 text-gray-800">Recent GST Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">GST</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gstTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{transaction.desc}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{transaction.amount}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{transaction.gst}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="text-base font-semibold mb-4 text-gray-800">Recent Activity</h3>
          <ul className="divide-y text-sm text-gray-700">
            {activityData.map(i => (
              <li key={i.id} className="py-2 flex justify-between">
                <span>{i.desc}</span>
                <span className="text-gray-500">{i.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
