// Sample data - Replace with real data from your API
const recentInvoices = [
  { id: 'INV001', customer: 'Tech Solutions Ltd', amount: 45000, status: 'PAID', date: '2024-03-15' },
  { id: 'INV002', customer: 'Global Traders', amount: 32000, status: 'PENDING', date: '2024-03-14' },
  { id: 'INV003', customer: 'Innovative Systems', amount: 28000, status: 'PAID', date: '2024-03-13' },
  { id: 'INV004', customer: 'Prime Industries', amount: 56000, status: 'OVERDUE', date: '2024-03-10' },
  { id: 'INV005', customer: 'Digital Services', amount: 41000, status: 'PAID', date: '2024-03-09' },
];

export default function RecentInvoices() {
  return (
    <div className="bg-white rounded-lg shadow">
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
  );
} 