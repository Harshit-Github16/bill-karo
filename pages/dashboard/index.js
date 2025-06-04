import { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import RevenueChart from '../../components/RevenueChart';
import GSTDistribution from '../../components/GSTDistribution';
import RecentInvoices from '../../components/RecentInvoices';
import StatsCards from '../../components/StatsCards';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Dashboard - BillKaro</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <div className="lg:pl-56">
          {/* Top Navigation */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1 items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <main className="py-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <StatsCards />
              
              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <RevenueChart />
                <GSTDistribution />
              </div>

              <div className="mt-8">
                <RecentInvoices />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
} 