import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { getOrders, getOrderItems, updateOrderStatus } from '../../services/orders'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from '../../types'

const statuses: OrderStatus[] = ['ny', 'vantar_betalning', 'betald', 'packas', 'skickad', 'klar']

export function AdminOrdersPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getOrders,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Status uppdaterad')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const OrderItems = ({ orderId }: { orderId: string }) => {
    const { data: items } = useQuery({
      queryKey: ['admin-order-items', orderId],
      queryFn: () => getOrderItems(orderId),
    })

    return (
      <div className="space-y-2 mt-3">
        {items?.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{item.product?.name ?? 'Produkt'} x{item.quantity}</span>
            <span>{item.price * item.quantity} kr</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Beställningar</h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <Package className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status as OrderStatus] || ORDER_STATUS_COLORS.ny}`}>
                      {ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{order.customer_name}</span>
                    <span>•</span>
                    <span>{new Date(order.created_at).toLocaleDateString('sv-SE', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}</span>
                    <span>•</span>
                    <span className="font-medium text-amber-600">{order.total} kr</span>
                  </div>
                </div>
                {expanded === order.id ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {expanded === order.id && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kund</p>
                      <p className="text-sm text-gray-900 dark:text-white">{order.customer_name}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                      <p className="text-sm text-gray-500">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Adress</p>
                      <p className="text-sm text-gray-900 dark:text-white">{order.address}</p>
                      <p className="text-sm text-gray-500">{order.postal_code} {order.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                      <select
                        value={order.status}
                        onChange={(e) => updateMutation.mutate({ id: order.id, status: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {order.message && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Meddelande</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        {order.message}
                      </p>
                    </div>
                  )}

                  <div className="mt-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Produkter</p>
                    <OrderItems orderId={order.id} />
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 flex justify-between font-semibold text-gray-900 dark:text-white">
                      <span>Totalt</span>
                      <span className="text-amber-600">{order.total} kr</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p>Inga beställningar än</p>
        </div>
      )}
    </div>
  )
}
