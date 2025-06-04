import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data - Replace with real data from your API
const monthlyRevenue = [
  { month: 'Jan', amount: 125000 },
  { month: 'Feb', amount: 165000 },
  { month: 'Mar', amount: 145000 },
  { month: 'Apr', amount: 185000 },
  { month: 'May', amount: 155000 },
  { month: 'Jun', amount: 190000 },
];

export default function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
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
            <Tooltip 
              formatter={(value) => `₹${value.toLocaleString()}`}
              labelStyle={{ color: '#111827' }}
            />
            <Legend />
            <Bar dataKey="amount" name="Revenue" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 