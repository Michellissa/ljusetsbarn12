import { motion } from 'framer-motion'
import { Package, Tags, AlertTriangle, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Product, Category } from '../../types'
import { Skeleton } from '../../components/ui/LoadingSkeleton'
import { Link } from 'react-router-dom'

export function AdminDashboardPage() {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-dashboard-products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      return (data as Product[]) ?? []
    },
  })

  const { data: categories } = useQuery({
    queryKey: ['admin-dashboard-categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*')
      return (data as Category[]) ?? []
    },
  })

  const lowStock = products?.filter((p) => p.stock > 0 && p.stock <= 5) ?? []
  const recentProducts = products?.slice(0, 5) ?? []

  if (productsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    )
  }

  const stats = [
    { label: 'Produkter', value: products?.length ?? 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100 ' },
    { label: 'Kategorier', value: categories?.length ?? 0, icon: Tags, color: 'text-green-600', bg: 'bg-green-100 ' },
    { label: 'Lågt lager', value: lowStock.length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100 ' },
    { label: 'Senaste 30 dagar', value: products?.filter((p) => {
      const d = new Date(p.created_at)
      const now = new Date()
      return (now.getTime() - d.getTime()) < 30 * 24 * 60 * 60 * 1000
    }).length ?? 0, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100 ' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900  mb-6">Översikt</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white  rounded-xl border border-gray-200  p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 ">{stat.value}</p>
            <p className="text-sm text-gray-500  mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white  rounded-xl border border-gray-200  p-6">
          <h3 className="text-lg font-semibold text-gray-900  mb-4">Produkter med lågt lager</h3>
          {lowStock.length > 0 ? (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <Link
                  key={p.id}
                  to={`/admin/produkter`}
                  className="flex items-center justify-between p-3 rounded-lg bg-amber-50  hover:bg-amber-100  transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900 ">{p.name}</span>
                  <span className="text-sm text-amber-600 font-medium">{p.stock} st</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 ">Inga produkter med lågt lager</p>
          )}
        </div>

        <div className="bg-white  rounded-xl border border-gray-200  p-6">
          <h3 className="text-lg font-semibold text-gray-900  mb-4">Senast tillagda produkter</h3>
          {recentProducts.length > 0 ? (
            <div className="space-y-3">
              {recentProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 ">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 ">{p.name}</p>
                      <p className="text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString('sv-SE')}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-amber-600">{p.price} kr</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 ">Inga produkter tillagda än</p>
          )}
        </div>
      </div>
    </div>
  )
}
