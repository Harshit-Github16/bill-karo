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

const orderStats = [
  {
    title: 'Total Orders',
    value: '156',
    change: '+12.5%',
    changeType: 'positive',
    icon: ShoppingBagIcon,
  },
  {
    title: 'In Transit',
    value: '24',
    desc: '15% of total',
    icon: TruckIcon,
  },
  {
    title: 'Completed',
    value: '120',
    desc: '77% of total',
    icon: CheckCircleIcon,
  },
  {
    title: 'Pending',
    value: '12',
    desc: '8% of total',
    icon: ClockIcon,
  },
];

const orders = [
  {
    id: 'ORD001',
    customer: 'Tech Solutions Ltd',
    date: '2024-03-15',
    amount: 45000,
    status: 'In Transit',
    items: 5,
    deliveryDate: '2024-03-20',
    trackingId: 'TRK123456',
  },
  {
    id: 'ORD002',
    customer: 'Digital Services Inc',
    date: '2024-03-12',
    amount: 28000,
    status: 'Pending',
    items: 3,
    deliveryDate: '2024-03-18',
    trackingId: 'TRK123457',
  },
  {
    id: 'ORD003',
    customer: 'Marketing Pro',
    date: '2024-03-10',
    amount: 35000,
    status: 'Delivered',
    items: 4,
    deliveryDate: '2024-03-15',
    trackingId: 'TRK123458',
  },
];

const recentUpdates = [
  {
    id: 1,
    order: 'ORD001',
    status: 'Package in transit',
    timestamp: '2 hours ago',
    description: 'Package has left the warehouse',
  },
  {
    id: 2,
    order: 'ORD002',
    status: 'Order confirmed',
    timestamp: '5 hours ago',
    description: 'Order has been confirmed and is being processed',
  },
  {
    id: 3,
    order: 'ORD003',
    status: 'Delivered',
    timestamp: '1 day ago',
    description: 'Package has been delivered successfully',
  },
];

function OrderStats() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {orderStats.map((stat) => (
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
        {recentUpdates.map((update) => (
          <div key={update.id} className="py-4 flex items-start space-x-4">
            <div className={`rounded-full p-2 ${
              update.status === 'Delivered'
                ? 'bg-green-100 text-green-600'
                : update.status === 'Package in transit'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-blue-100 text-blue-600'
            }`}>
              {update.status === 'Delivered' ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : update.status === 'Package in transit' ? (
                <TruckIcon className="h-5 w-5" />
              ) : (
                <ClockIcon className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {update.order} - {update.status}
                </p>
                <span className="text-sm text-gray-500">
                  {update.timestamp}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {update.description}
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
    <DashboardLayout
      title="Orders"
      description="Track and manage your orders"
    >
      <div className="space-y-6 animate-fade-in">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track and manage your business orders
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary"
            >
              <TruckIcon className="h-5 w-5 mr-2" />
              Track Shipments
            </motion.button>
          </div>
        </div>

        <OrderStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrderList />
          </div>
          <div>
            <OrderUpdates />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 