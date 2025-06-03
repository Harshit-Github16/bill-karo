import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Dialog } from '@headlessui/react';
import {
  DocumentCheckIcon,
  CalendarIcon,
  ArrowUpTrayIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Sample GST returns data
const initialReturns = [
  {
    id: 1,
    period: 'March 2024',
    type: 'GSTR-1',
    dueDate: '2024-04-11',
    status: 'Pending',
    taxableAmount: '₹8,50,000',
    gstAmount: '₹1,53,000',
  },
  {
    id: 2,
    period: 'March 2024',
    type: 'GSTR-3B',
    dueDate: '2024-04-20',
    status: 'Not Started',
    taxableAmount: '₹8,50,000',
    gstAmount: '₹1,53,000',
  },
  {
    id: 3,
    period: 'February 2024',
    type: 'GSTR-1',
    dueDate: '2024-03-11',
    status: 'Filed',
    taxableAmount: '₹7,25,000',
    gstAmount: '₹1,30,500',
    filedDate: '2024-03-10',
  },
  {
    id: 4,
    period: 'February 2024',
    type: 'GSTR-3B',
    dueDate: '2024-03-20',
    status: 'Filed',
    taxableAmount: '₹7,25,000',
    gstAmount: '₹1,30,500',
    filedDate: '2024-03-18',
  },
];

const stats = [
  {
    name: 'Total Tax Liability',
    value: '₹1,53,000',
    description: 'For current period',
    icon: DocumentCheckIcon,
  },
  {
    name: 'Next Due Date',
    value: 'April 11, 2024',
    description: 'GSTR-1 filing',
    icon: CalendarIcon,
  },
  {
    name: 'Pending Returns',
    value: '2',
    description: 'For March 2024',
    icon: ExclamationCircleIcon,
  },
];

export default function GSTManagement() {
  const [returns, setReturns] = useState(initialReturns);
  const [isFileReturnOpen, setIsFileReturnOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [fileDetails, setFileDetails] = useState({
    taxableAmount: '',
    gstAmount: '',
    remarks: '',
  });

  const handleFileReturn = (gstReturn) => {
    setSelectedReturn(gstReturn);
    setFileDetails({
      taxableAmount: gstReturn.taxableAmount.replace('₹', '').replace(',', ''),
      gstAmount: gstReturn.gstAmount.replace('₹', '').replace(',', ''),
      remarks: '',
    });
    setIsFileReturnOpen(true);
  };

  const handleSubmitReturn = (e) => {
    e.preventDefault();
    const updatedReturns = returns.map((ret) => {
      if (ret.id === selectedReturn.id) {
        return {
          ...ret,
          status: 'Filed',
          filedDate: new Date().toISOString().split('T')[0],
          taxableAmount: `₹${parseFloat(fileDetails.taxableAmount).toLocaleString('en-IN')}`,
          gstAmount: `₹${parseFloat(fileDetails.gstAmount).toLocaleString('en-IN')}`,
        };
      }
      return ret;
    });
    setReturns(updatedReturns);
    setIsFileReturnOpen(false);
  };

  return (
    <DashboardLayout title="GST Management" description="Track and file your GST returns">
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">GST Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track, manage and file your GST returns
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-blue-500 p-3">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </dd>
              <dd className="ml-16 text-sm text-gray-500">{stat.description}</dd>
            </div>
          ))}
        </div>

        {/* Returns Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Return Type</th>
                <th>Due Date</th>
                <th>Taxable Amount</th>
                <th>GST Amount</th>
                <th>Status</th>
                <th>Filed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {returns.map((gstReturn) => (
                <tr key={gstReturn.id}>
                  <td>{gstReturn.period}</td>
                  <td>{gstReturn.type}</td>
                  <td>{gstReturn.dueDate}</td>
                  <td>{gstReturn.taxableAmount}</td>
                  <td>{gstReturn.gstAmount}</td>
                  <td>
                    <span
                      className={`badge ${
                        gstReturn.status === 'Filed'
                          ? 'badge-success'
                          : gstReturn.status === 'Pending'
                          ? 'badge-warning'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {gstReturn.status}
                    </span>
                  </td>
                  <td>{gstReturn.filedDate || '-'}</td>
                  <td>
                    {gstReturn.status !== 'Filed' && (
                      <button
                        onClick={() => handleFileReturn(gstReturn)}
                        className="btn btn-primary btn-sm"
                      >
                        File Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* File Return Modal */}
        <Dialog
          open={isFileReturnOpen}
          onClose={() => setIsFileReturnOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-lg rounded-xl bg-white p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                File GST Return - {selectedReturn?.type} for {selectedReturn?.period}
              </Dialog.Title>

              <form onSubmit={handleSubmitReturn} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Taxable Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    className="input mt-1"
                    value={fileDetails.taxableAmount}
                    onChange={(e) =>
                      setFileDetails({ ...fileDetails, taxableAmount: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    GST Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    className="input mt-1"
                    value={fileDetails.gstAmount}
                    onChange={(e) =>
                      setFileDetails({ ...fileDetails, gstAmount: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Remarks (Optional)
                  </label>
                  <textarea
                    className="input mt-1"
                    rows={3}
                    value={fileDetails.remarks}
                    onChange={(e) =>
                      setFileDetails({ ...fileDetails, remarks: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsFileReturnOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    File Return
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