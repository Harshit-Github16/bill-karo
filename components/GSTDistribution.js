import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Sample data - Replace with real data from your API
const gstData = [
  { name: 'CGST', value: 25000 },
  { name: 'SGST', value: 25000 },
  { name: 'IGST', value: 35000 },
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B'];

export default function GSTDistribution() {
  return (
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
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 