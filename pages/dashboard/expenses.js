import DashboardLayout from '../../components/DashboardLayout';

const expenses = [
  {
    id: 1,
    date: '2024-03-12',
    category: 'Office Supplies',
    description: 'Printer Paper and Ink',
    amount: '₹2,500',
    paymentMethod: 'Credit Card',
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-03-11',
    category: 'Utilities',
    description: 'Electricity Bill',
    amount: '₹4,750',
    paymentMethod: 'Bank Transfer',
    status: 'completed'
  },
  {
    id: 3,
    date: '2024-03-10',
    category: 'Marketing',
    description: 'Facebook Ads',
    amount: '₹15,000',
    paymentMethod: 'Credit Card',
    status: 'pending'
  },
  {
    id: 4,
    date: '2024-03-09',
    category: 'Travel',
    description: 'Business Trip to Mumbai',
    amount: '₹25,800',
    paymentMethod: 'Company Card',
    status: 'completed'
  },
  {
    id: 5,
    date: '2024-03-08',
    category: 'Software',
    description: 'Adobe Creative Suite Subscription',
    amount: '₹5,400',
    paymentMethod: 'Credit Card',
    status: 'completed'
  }
];

const categories = [
  { name: 'Office Supplies', total: '₹12,500', percentage: 25 },
  { name: 'Utilities', total: '₹8,750', percentage: 15 },
  { name: 'Marketing', total: '₹15,000', percentage: 30 },
  { name: 'Travel', total: '₹25,800', percentage: 20 },
  { name: 'Software', total: '₹5,400', percentage: 10 }
];

export default function Expenses() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>
            <p className="mt-1 text-sm text-gray-500">Track and manage your business expenses</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add New Expense
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Expenses (This Month)</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">₹53,450</p>
            <p className="text-sm text-red-600 mt-1">+12.5% from last month</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Average Daily Expense</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">₹1,781</p>
            <p className="text-sm text-green-600 mt-1">-3.2% from last month</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Pending Expenses</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">₹15,000</p>
            <p className="text-sm text-gray-500 mt-1">1 pending approval</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Expense Categories</h3>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600">{category.name}</span>
                    <span className="text-sm font-medium text-gray-900">{category.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Recent Expenses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        expense.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 