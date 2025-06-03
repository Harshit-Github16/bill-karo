import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  TruckIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

const orders = [
  {
    id: 'ORD001',
    customer: 'Rahul Sharma',
    date: '2024-03-12',
    items: 3,
    total: '₹12,500',
    status: 'completed',
    payment: 'paid'
  },
  {
    id: 'ORD002',
    customer: 'Priya Patel',
    date: '2024-03-11',
    items: 2,
    total: '₹8,750',
    status: 'processing',
    payment: 'pending'
  },
  {
    id: 'ORD003',
    customer: 'Amit Kumar',
    date: '2024-03-11',
    items: 5,
    total: '₹24,000',
    status: 'completed',
    payment: 'paid'
  },
  {
    id: 'ORD004',
    customer: 'Sneha Gupta',
    date: '2024-03-10',
    items: 1,
    total: '₹5,200',
    status: 'cancelled',
    payment: 'refunded'
  },
  {
    id: 'ORD005',
    customer: 'Vikram Singh',
    date: '2024-03-10',
    items: 4,
    total: '₹15,800',
    status: 'processing',
    payment: 'paid'
  }
];

const stats = [
  {
    title: 'Total Orders',
    value: '158',
    change: '+12.5%',
    changeType: 'positive',
    period: 'from last month'
  },
  {
    title: 'Average Order Value',
    value: '₹13,250',
    change: '+8.2%',
    changeType: 'positive',
    period: 'from last month'
  },
  {
    title: 'Pending Orders',
    value: '12',
    change: '-5%',
    changeType: 'negative',
    period: 'from last week'
  }
];

const getStatusColor = (status) => {
  const colors = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getPaymentStatusColor = (status) => {
  const colors = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    refunded: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

function OrderStats() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className="stat-card card-hover">
          <div className="flex items-center justify-between">
            <p className="stat-title">{stat.title}</p>
            <stat.icon className="h-5 w-5 text-gray-400" />
          </div>
          <p className="stat-value">{stat.value}</p>
          {stat.change && (
            <p className={`inline-flex items-center text-sm ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </p>
          )}
          {stat.desc && (
            <p className="text-sm text-gray-500">{stat.desc}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    items: [{ description: '', quantity: 1, price: 0 }]
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOrder,
          orderId: `ORD-${Date.now()}`,
          amount: newOrder.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create order');
      
      await fetchOrders();
      setShowCreateModal(false);
      setNewOrder({
        customer: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        items: [{ description: '', quantity: 1, price: 0 }]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const addOrderItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const updateOrderItem = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index][field] = value;
    setNewOrder({
      ...newOrder,
      items: updatedItems
    });
  };

  const removeOrderItem = (index) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((_, i) => i !== index)
    });
  };

  const filteredOrders = orders.filter(order => 
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Orders</h3>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your orders
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
            <button className="btn btn-secondary">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <button className="btn btn-secondary">
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            New Order
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="font-medium text-gray-900">{order.orderId}</td>
                <td>{order.customer}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td className="font-medium text-gray-900">
                  ₹{order.amount.toLocaleString()}
                </td>
                <td>
                  <span className={`badge ${
                    order.status === 'Delivered'
                      ? 'badge-success'
                      : order.status === 'In Transit'
                      ? 'badge-warning'
                      : 'badge-danger'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.deliveryDate}</td>
                <td>
                  <div className="flex space-x-3">
                    <button className="btn btn-secondary btn-sm">Track</button>
                    <button className="btn btn-primary btn-sm">Details</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-lg font-medium mb-4">Create New Order</h2>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    className="input mt-1"
                    value={newOrder.customer}
                    onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    className="input mt-1"
                    value={newOrder.date}
                    onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-900">Items</h4>
                  <button
                    type="button"
                    onClick={addOrderItem}
                    className="btn btn-secondary text-sm"
                  >
                    Add Item
                  </button>
                </div>

                {newOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <input
                        type="text"
                        placeholder="Description"
                        required
                        className="input"
                        value={item.description}
                        onChange={(e) => updateOrderItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Quantity"
                        required
                        min="1"
                        className="input"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Price"
                        required
                        className="input"
                        value={item.price}
                        onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <button
                        type="button"
                        onClick={() => removeOrderItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderUpdates() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Recent Updates</h3>
          <p className="text-sm text-gray-500 mt-1">
            Latest order status updates
          </p>
        </div>
        <button className="btn btn-secondary">
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <div key={order.id} className="py-4 flex items-start space-x-4">
            <div className={`rounded-full p-2 ${
              order.status === 'Delivered'
                ? 'bg-green-100 text-green-600'
                : order.status === 'Package in transit'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-blue-100 text-blue-600'
            }`}>
              {order.status === 'Delivered' ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : order.status === 'Package in transit' ? (
                <TruckIcon className="h-5 w-5" />
              ) : (
                <ClockIcon className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {order.id} - {order.status}
                </p>
                <span className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {order.customer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Orders() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and track your orders</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create New Order
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className={`text-sm mt-1 ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} {stat.period}
              </p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.payment)}`}>
                        {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
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