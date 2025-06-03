'use client'
import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { ArrowUpIcon, ArrowDownIcon, CurrencyRupeeIcon, DocumentChartBarIcon, BanknotesIcon, ReceiptPercentIcon } from '@heroicons/react/24/outline'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

const stats = [
  { name: 'Total Revenue', value: '₹42,50,000', change: '+4.75%', changeType: 'positive', icon: CurrencyRupeeIcon },
  { name: 'Total Expenses', value: '₹28,65,000', change: '+2.15%', changeType: 'negative', icon: BanknotesIcon },
  { name: 'Pending Invoices', value: '₹8,75,000', change: '-1.25%', changeType: 'positive', icon: DocumentChartBarIcon },
  { name: 'GST Payable', value: '₹2,15,000', change: '+0.55%', changeType: 'negative', icon: ReceiptPercentIcon },
]

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'Revenue', data: [450000, 520000, 480000, 580000, 620000, 750000], borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.3)', tension: 0.4, fill: true },
    { label: 'Expenses', data: [320000, 350000, 360000, 420000, 450000, 480000], borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.3)', tension: 0.4, fill: true }
  ]
}

const categoryData = {
  labels: ['Services', 'Products', 'Consulting', 'Others'],
  datasets: [
    { data: [45, 25, 20, 10], backgroundColor: ['#3B82F6', '#10B981', '#FBBF24', '#EF4444'] }
  ]
}

const expenseData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'Monthly Expenses', data: [320000, 350000, 360000, 420000, 450000, 480000], backgroundColor: '#F87171' }
  ]
}

export default function Reports() {
  const [timeframe, setTimeframe] = useState('6M')

  return (
    <DashboardLayout title="Reports & Analytics" description="Business metrics and visual breakdown">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-sm text-gray-600">Visual overview of your financial health</p>
          </div>
          <select value={timeframe} onChange={e => setTimeframe(e.target.value)} className="rounded-md border-gray-300 text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500">
            <option value="1M">Last Month</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="1Y">Last Year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow flex gap-4">
              <div className="bg-blue-500 p-2 rounded-md"><item.icon className="h-5 w-5 text-white" /></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">{item.name}</p>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
                <div className={`flex items-center text-sm ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.changeType === 'positive' ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                  {item.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Revenue vs Expenses</h3>
            <div className="h-[300px]">
              <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => `₹${v.toLocaleString()}` } } } }} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Revenue by Category</h3>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Monthly Expenses</h3>
            <div className="h-[300px]">
              <Bar data={expenseData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => `₹${v.toLocaleString()}` } } } }} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
