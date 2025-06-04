import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  HomeIcon, BanknotesIcon, ChartBarIcon, DocumentTextIcon,
  ClipboardDocumentListIcon, ArrowTrendingUpIcon, Cog6ToothIcon, XMarkIcon
} from '@heroicons/react/24/outline'
import Logo from './Logo'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'GST', href: '/dashboard/gst-management', icon: BanknotesIcon },
  { name: 'Expenses', href: '/dashboard/expenses', icon: ChartBarIcon },
  { name: 'Reports', href: '/dashboard/reports', icon: DocumentTextIcon },
  { name: 'Orders', href: '/dashboard/orders', icon: ClipboardDocumentListIcon },
  { name: 'Cash Flow', href: '/dashboard/cash-flow', icon: ArrowTrendingUpIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon }
]

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { pathname } = useRouter()

  const NavList = () => (
    <ul role="list" className="flex flex-1 flex-col gap-y-4">
      {navigation.map(({ name, href, icon: Icon }) => (
        <li key={name}>
          <Link
            href={href}
            className={`group flex items-center gap-x-3 px-6 py-2 text-sm font-semibold ${
              pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                ? 'bg-gray-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
            }`}
          >
            <Icon className="h-6 w-6 shrink-0" />
            {name}
          </Link>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white lg:hidden transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="small" />
          </Link>
          <button className="-m-2.5 p-2.5 text-gray-700" onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col py-4">
          <NavList />
          Hello
        </nav>
      </div>

      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-56 lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Logo size="small" />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col py-4">
          <NavList />
        </nav>
      </div>
    </>
  )
}
