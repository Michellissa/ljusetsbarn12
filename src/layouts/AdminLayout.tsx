import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  Tags,
  Mail,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ClipboardList,
  Settings,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'

const adminNav = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Produkter', path: '/admin/produkter', icon: Package },
  { label: 'Kategorier', path: '/admin/kategorier', icon: Tags },
  { label: 'Beställningar', path: '/admin/bestallningar', icon: ClipboardList },
  { label: 'Meddelanden', path: '/admin/meddelanden', icon: Mail },
  { label: 'Inställningar', path: '/admin/installningar', icon: Settings },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <AnimatePresence mode="wait">
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 256 : 64 }}
          className="fixed left-0 top-0 h-full bg-white  border-r border-gray-200  z-30 overflow-hidden"
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 ">
            {sidebarOpen && (
              <span className="text-lg font-semibold text-gray-900  whitespace-nowrap">
                Admin
              </span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100  transition-colors"
            >
              <ChevronLeft className={cn('w-5 h-5 transition-transform', !sidebarOpen && 'rotate-180')} />
            </button>
          </div>
          <nav className="p-2 space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.path
                    ? 'bg-amber-50  text-amber-600'
                    : 'text-gray-700  hover:bg-gray-100 '
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50  transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>Logga ut</span>}
            </button>
          </nav>
        </motion.aside>
      </AnimatePresence>

      <div className={cn('transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-16')}>
        <header className="sticky top-0 z-20 h-16 bg-white/95  backdrop-blur-md border-b border-gray-200  flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-lg font-semibold text-gray-900 ">
            {adminNav.find((n) => n.path === location.pathname)?.label ?? 'Admin'}
          </h1>
          <div />
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
