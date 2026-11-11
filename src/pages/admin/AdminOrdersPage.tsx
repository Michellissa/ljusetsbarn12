import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, ChevronDown, ChevronUp, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { getOrders, getOrderItems, updateOrderStatus, markOrderShipped } from '../../services/orders'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type Order, type OrderStatus } from '../../types'

const statuses: OrderStatus[] = ['ny', 'vantar_betalning', 'betald', 'packas', 'skickad', 'klar']

function OrderItems({ orderId }: { orderId: string }) {
  const { data: items } = useQuery({
    queryKey: ['admin-order-items', orderId],
    queryFn: () => getOrderItems(orderId),
  })

  return (
    <div className="space-y-2 mt-3">
      {items?.map((item) => (
        <div key={item.id} className="flex justify-between text-sm text-gray-600 ">
          <span>{item.product_name ?? item.product?.name ?? 'Produkt'} x{item.quantity}</span>
          <span>{item.price * item.quantity} kr</span>
        </div>
      ))}
    </div>
  )
}

function ShippingControls({
  order,
  onShipped,
  saving,
}: {
  order: Order
  onShipped: (id: string, tracking: string, carrier: string) => void
  saving: boolean
}) {
  const [tracking, setTracking] = useState(order.tracking_number ?? '')
  const [carrier, setCarrier] = useState(order.carrier ?? 'PostNord')

  return (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
      <div>
        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Spårningsnummer</label>
        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300  rounded-lg bg-white  text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Transportör</label>
        <select
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300  rounded-lg bg-white  text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option>PostNord</option>
          <option>DB Schenker</option>
          <option>Bring</option>
          <option>Annat</option>
        </select>
      </div>
      <button
        onClick={() => onShipped(order.id, tracking, carrier)}
        disabled={saving || !tracking.trim()}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        <Truck className="w-4 h-4" /> Markera skickad
      </button>
    </div>
  )
}

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

  const shipMutation = useMutation({
    mutationFn: ({ id, tracking, carrier }: { id: string; tracking: string; carrier: string }) =>
      markOrderShipped(id, tracking, carrier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Order markerad som skickad')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900  mb-6">Beställningar</h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100  rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white  rounded-xl border border-gray-200  overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50  transition-colors"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <Package className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-900 ">
                      #{order.order_number}
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
                <div className="px-4 pb-4 pt-0 border-t border-gray-200 ">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kund</p>
                      <p className="text-sm text-gray-900 ">{order.customer_name}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                      <p className="text-sm text-gray-500">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Adress</p>
                      <p className="text-sm text-gray-900 ">{order.address}</p>
                      <p className="text-sm text-gray-500">{order.postal_code} {order.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                      <select
                        value={order.status}
                        onChange={(e) => updateMutation.mutate({ id: order.id, status: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300  rounded-lg bg-white  text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                      {order.paid_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Betald {new Date(order.paid_at).toLocaleDateString('sv-SE')}
                        </p>
                      )}
                    </div>
                  </div>

                  {order.message && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Meddelande</p>
                      <p className="text-sm text-gray-600  bg-gray-50  rounded-lg p-3">
                        {order.message}
                      </p>
                    </div>
                  )}

                  <div className="mt-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Produkter</p>
                    <OrderItems orderId={order.id} />
                    <div className="border-t border-gray-200  mt-2 pt-2 flex justify-between font-semibold text-gray-900 ">
                      <span>Totalt</span>
                      <span className="text-amber-600">{order.total} kr</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Leverans</p>
                    <ShippingControls
                      order={order}
                      saving={shipMutation.isPending}
                      onShipped={(id, tracking, carrier) =>
                        shipMutation.mutate({ id, tracking, carrier })
                      }
                    />
                    {order.tracking_number && (
                      <p className="text-sm text-gray-500 mt-2">
                        Nuvarande spårning: {order.tracking_number}
                        {order.carrier ? ` (${order.carrier})` : ''}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300 " />
          <p>Inga beställningar än</p>
        </div>
      )}
    </div>
  )
}
