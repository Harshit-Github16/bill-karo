import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { getMetaData } from '@/config/meta'
import { CurrencyRupeeIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    accounts: [],
    expenses: [],
    transactions: []
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, expensesRes] = await Promise.all([
          fetch('/api/accounts'),
          fetch('/api/expenses')
        ])

        const [accountsData, expensesData] = await Promise.all([
          accountsRes.json(),
          expensesRes.json()
        ])

        setData({
          accounts: accountsData,
          expenses: expensesData,
          transactions: []
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const stats = [
    {
      name: 'Revenue',
      value: 458000,
      change: '+12.5%',
      trend: 'up',
      color: 'indigo',
      data: [65, 72, 68, 85, 78, 90]
    },
    {
      name: 'Expenses',
      value: 105000,
      change: '+5.2%',
      trend: 'up',
      color: 'pink',
      data: [12, 8, 25, 45, 15, 20]
    },
    {
      name: 'Profit',
      value: 353000,
      change: '+15.3%',
      trend: 'up',
      color: 'green',
      data: [53, 64, 43, 40, 63, 70]
    },
    {
      name: 'Outstanding',
      value: 35000,
      change: '4 pending',
      trend: 'neutral',
      color: 'orange',
      data: [10, 15, 8, 12, 5, 7]
    }
  ]

  const expenseCategories = [
    { name: 'Office', amount: 12000, color: 'bg-indigo-500' },
    { name: 'Utilities', amount: 8000, color: 'bg-orange-500' },
    { name: 'Rent', amount: 25000, color: 'bg-purple-500' },
    { name: 'Salaries', amount: 45000, color: 'bg-pink-500' },
    { name: 'Marketing', amount: 15000, color: 'bg-cyan-500' }
  ]

  return (
    <Layout meta={getMetaData({ title: 'Reports', description: 'View and analyze your financial reports' })}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Financial Reports</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and analyze your business performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border-gray-300 rounded-md"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                        <CurrencyRupeeIcon className={`h-5 w-5 text-${stat.color}-600`} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(stat.value)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`text-sm text-${stat.color}-600 flex items-center`}>
                        {stat.trend === 'up' && <ArrowUpIcon className="h-4 w-4 mr-0.5" />}
                        {stat.trend === 'down' && <ArrowDownIcon className="h-4 w-4 mr-0.5" />}
                        {stat.change}
                      </div>
                      <div className="mt-2 h-8">
                        <Line
                          data={{
                            labels: ['', '', '', '', '', ''],
                            datasets: [{
                              data: stat.data,
                              borderColor: `rgb(${stat.color === 'indigo' ? '99, 102, 241' : 
                                           stat.color === 'pink' ? '236, 72, 153' : 
                                           stat.color === 'green' ? '34, 197, 94' : 
                                           '251, 146, 60'})`,
                              borderWidth: 2,
                              tension: 0.4,
                              pointRadius: 0
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                              x: { display: false },
                              y: { display: false }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Expense Categories */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-base font-medium text-gray-900 mb-4">Expense Categories</h3>
                <div className="space-y-3">
                  {expenseCategories.map((category) => (
                    <div key={category.name} className="flex items-center">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-500">{category.name}</span>
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(category.amount)}</span>
                        </div>
                        <div className="overflow-hidden h-1.5 bg-gray-100 rounded-full">
                          <div
                            className={`h-full ${category.color}`}
                            style={{ width: `${(category.amount / 105000) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-gray-900">Recent Transactions</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
                </div>
                <div className="overflow-hidden">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-xs text-gray-500 border-b border-gray-100">
                        <th className="pb-2 font-medium text-left">Date</th>
                        <th className="pb-2 font-medium text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.expenses.slice(0, 5).map((expense, index) => (
                        <tr key={index} className="text-sm">
                          <td className="py-2 text-gray-900">
                            {new Date(expense.date).toLocaleDateString('en-IN', { 
                              day: 'numeric',
                              month: 'short'
                            })}
                          </td>
                          <td className="py-2 text-right font-medium text-gray-900">
                            {formatCurrency(expense.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
