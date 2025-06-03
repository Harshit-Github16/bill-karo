import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Dialog } from '@headlessui/react';
import {
  PlusIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

// Sample invoice data - Replace with your API data
const sampleInvoices = [
  {
    id: 'INV-2024-001',
    customer: 'Tech Solutions Pvt Ltd',
    amount: '₹45,000',
    status: 'Paid',
    date: '2024-03-15',
    dueDate: '2024-04-15',
  },
  {
    id: 'INV-2024-002',
    customer: 'Digital Services Ltd',
    amount: '₹78,500',
    status: 'Pending',
    date: '2024-03-10',
    dueDate: '2024-04-10',
  },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customer: '',
    amount: '',
    date: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, rate: '', amount: '' }],
  });

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const invoice = {
      id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      ...newInvoice,
      status: 'Pending',
      amount: `₹${parseFloat(newInvoice.amount).toLocaleString('en-IN')}`,
    };
    setInvoices([invoice, ...invoices]);
    setIsCreateModalOpen(false);
    setNewInvoice({
      customer: '',
      amount: '',
      date: '',
      dueDate: '',
      items: [{ description: '', quantity: 1, rate: '', amount: '' }],
    });
  };

  const addInvoiceItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: '', quantity: 1, rate: '', amount: '' }],
    });
  };

  const updateInvoiceItem = (index, field, value) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index][field] = value;
    
    // Calculate amount if quantity and rate are present
    if (field === 'quantity' || field === 'rate') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].amount = (quantity * rate).toString();
    }

    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      amount: updatedItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toString(),
    });
  };

  const removeInvoiceItem = (index) => {
    const updatedItems = newInvoice.items.filter((_, i) => i !== index);
    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      amount: updatedItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toString(),
    });
  };

  return (
    <DashboardLayout title="Invoices" description="Manage your invoices">
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
            <p className="mt-2 text-sm text-gray-700">
              Create and manage your invoices
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Invoice
            </button>
          </div>
        </div>

        {/* Invoices List */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.customer}</td>
                  <td>{invoice.amount}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.dueDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        invoice.status === 'Paid' ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-3">
                      <button className="text-gray-400 hover:text-gray-500">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <DocumentDuplicateIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                      <button className="text-red-400 hover:text-red-500">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Invoice Modal */}
        <Dialog
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-3xl rounded-xl bg-white p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                Create New Invoice
              </Dialog.Title>

              <form onSubmit={handleCreateInvoice} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      required
                      className="input mt-1"
                      value={newInvoice.customer}
                      onChange={(e) =>
                        setNewInvoice({ ...newInvoice, customer: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Invoice Date
                    </label>
                    <input
                      type="date"
                      required
                      className="input mt-1"
                      value={newInvoice.date}
                      onChange={(e) =>
                        setNewInvoice({ ...newInvoice, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <input
                      type="date"
                      required
                      className="input mt-1"
                      value={newInvoice.dueDate}
                      onChange={(e) =>
                        setNewInvoice({ ...newInvoice, dueDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-900">Items</h4>
                    <button
                      type="button"
                      onClick={addInvoiceItem}
                      className="btn btn-secondary text-sm"
                    >
                      Add Item
                    </button>
                  </div>

                  {newInvoice.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Description"
                          required
                          className="input"
                          value={item.description}
                          onChange={(e) =>
                            updateInvoiceItem(index, 'description', e.target.value)
                          }
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
                          onChange={(e) =>
                            updateInvoiceItem(index, 'quantity', e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Rate"
                          required
                          className="input"
                          value={item.rate}
                          onChange={(e) =>
                            updateInvoiceItem(index, 'rate', e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Amount"
                          readOnly
                          className="input bg-gray-50"
                          value={item.amount}
                        />
                      </div>
                      <div className="col-span-1">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeInvoiceItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <div className="text-sm font-medium text-gray-700">
                      Total Amount: ₹{parseFloat(newInvoice.amount || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Invoice
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </DashboardLayout>
  );
} 