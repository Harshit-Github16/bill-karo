import Head from 'next/head';
import DashboardLayout from '../../../components/DashboardLayout';
import InvoiceForm from '../../../components/invoices/InvoiceForm';

export default function CreateInvoice() {
  return (
    <DashboardLayout>
      <Head>
        <title>Create Invoice - BillKaro</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Create New Invoice</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <InvoiceForm />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 