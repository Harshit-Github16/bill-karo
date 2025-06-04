import { CurrencyRupeeIcon, DocumentTextIcon, ExclamationCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const stats = [
  {
    title: 'Total Revenue',
    value: '₹9,65,000',
    icon: CurrencyRupeeIcon,
    trend: 12.5,
    color: 'bg-blue-500'
  },
  {
    title: 'Total Invoices',
    value: '142',
    icon: DocumentTextIcon,
    trend: 8.2,
    color: 'bg-green-500'
  },
  {
    title: 'Pending Amount',
    value: '₹1,25,000',
    icon: ExclamationCircleIcon,
    trend: -5.1,
    color: 'bg-yellow-500'
  },
  {
    title: 'GST Collected',
    value: '₹85,000',
    icon: ChartBarIcon,
    trend: 15.3,
    color: 'bg-purple-500'
  }
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
              <p className={`mt-2 text-sm ${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend >= 0 ? '↑' : '↓'} {Math.abs(stat.trend)}% from last month
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 