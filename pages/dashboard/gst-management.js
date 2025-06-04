import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import DashboardLayout from '../../components/DashboardLayout'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const GST_RATES = [5, 12, 18, 28];

const monthlyGSTData = [
  { month: 'Jan', input: 12500, output: 15000 },
  { month: 'Feb', input: 13200, output: 16800 },
  { month: 'Mar', input: 14500, output: 17200 },
  { month: 'Apr', input: 15800, output: 18500 },
];

const gstCategories = [
  { name: 'CGST', value: 8500 },
  { name: 'SGST', value: 8500 },
  { name: 'IGST', value: 12000 },
  { name: 'Pending Returns', value: 3000 },
];

export default function GSTManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState('June 2024')
  const [amount, setAmount] = useState('')
  const [gstRate, setGstRate] = useState(18)

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">
    <div className="h-10 w-10 animate-spin border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
  
  if (!session) {
    router.replace('/login')
    return null
  }

  const calculateGST = () => {
    const baseAmount = parseFloat(amount) || 0
    const gstAmount = (baseAmount * gstRate) / 100
    return {
      baseAmount,
      gstAmount,
      totalAmount: baseAmount + gstAmount,
      cgst: gstRate >= 18 ? gstAmount / 2 : 0,
      sgst: gstRate >= 18 ? gstAmount / 2 : 0,
      igst: gstRate < 18 ? gstAmount : 0
    }
  }

  const gstCalculation = calculateGST()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">GST Management</h2>
            <p className="text-sm text-gray-500 mt-1">Track and manage your GST returns</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Download GST Report
          </button>
        </div>

        {/* GST Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Total Input GST</h3>
            <p className="text-xl font-semibold mt-1">₹56,000</p>
            <span className="text-green-500 text-sm">+12% from last month</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Total Output GST</h3>
            <p className="text-xl font-semibold mt-1">₹67,500</p>
            <span className="text-green-500 text-sm">+8% from last month</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Net GST Payable</h3>
            <p className="text-xl font-semibold mt-1">₹11,500</p>
            <span className="text-red-500 text-sm">Due in 15 days</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Pending Returns</h3>
            <p className="text-xl font-semibold mt-1">2</p>
            <span className="text-yellow-500 text-sm">Action needed</span>
          </div>
        </div>

        {/* GST Calculator */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">GST Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Rate
              </label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                {GST_RATES.map(rate => (
                  <option key={rate} value={rate}>{rate}%</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount
              </label>
              <div className="p-2 bg-gray-50 rounded-lg border">
                ₹{gstCalculation.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CGST ({gstRate/2}%)
              </label>
              <div className="p-2 bg-gray-50 rounded-lg border">
                ₹{gstCalculation.cgst.toFixed(2)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SGST ({gstRate/2}%)
              </label>
              <div className="p-2 bg-gray-50 rounded-lg border">
                ₹{gstCalculation.sgst.toFixed(2)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IGST ({gstRate}%)
              </label>
              <div className="p-2 bg-gray-50 rounded-lg border">
                ₹{gstCalculation.igst.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-base font-semibold mb-4">Monthly GST Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyGSTData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="input" name="Input GST" fill="#0088FE" />
                <Bar dataKey="output" name="Output GST" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-base font-semibold mb-4">GST Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gstCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gstCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent GST Transactions */}
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Recent GST Transactions</h3>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border rounded-lg w-32"
            >
              <option>June 2024</option>
              <option>May 2024</option>
              <option>April 2024</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Base Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">GST</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { date: '2024-06-15', invoice: 'INV-001', type: 'Output', base: 10000, gst: 1800, status: 'Filed' },
                  { date: '2024-06-12', invoice: 'INV-002', type: 'Input', base: 5000, gst: 900, status: 'Pending' },
                  { date: '2024-06-10', invoice: 'INV-003', type: 'Output', base: 15000, gst: 2700, status: 'Filed' },
                ].map((tx, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-sm">{tx.date}</td>
                    <td className="px-4 py-2 text-sm">{tx.invoice}</td>
                    <td className="px-4 py-2 text-sm">{tx.type}</td>
                    <td className="px-4 py-2 text-sm">₹{tx.base}</td>
                    <td className="px-4 py-2 text-sm">₹{tx.gst}</td>
                    <td className="px-4 py-2 text-sm">₹{tx.base + tx.gst}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'Filed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tx.status}
                      </span>
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