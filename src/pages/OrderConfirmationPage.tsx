import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight, Truck } from 'lucide-react'
import { getOrderByToken } from '../services/orders'
import { ORDER_STATUS_LABELS, type OrderStatus } from '../types'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/LoadingSkeleton'

export function OrderConfirmationPage() {
  const { token } = useParams<{ token: string }>()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-by-token', token],
    queryFn: () => getOrderByToken(token!),
    enabled: !!token,
  })

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-48 mx-auto mb-8" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Beställningen kunde inte hittas.</p>
        <Link to="/" className="text-amber-600 hover:text-amber-700 mt-4 inline-block">Tillbaka till hem</Link>
      </div>
    )
  }

  const statusLabel = ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tack för din beställning!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ordernummer: <strong className="text-amber-600">{order.order_number}</strong>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Status: {statusLabel}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Spara denna sida som din orderbekräftelse. Vi kontaktar dig om något är oklart.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Orderdetaljer</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Namn</p>
            <p className="font-medium text-gray-900 dark:text-white">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">E-post</p>
            <p className="font-medium text-gray-900 dark:text-white">{order.email}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Telefon</p>
            <p className="font-medium text-gray-900 dark:text-white">{order.phone}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Adress</p>
            <p className="font-medium text-gray-900 dark:text-white">{order.address}, {order.postal_code} {order.city}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Produkter</h3>
          <div className="space-y-2">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {item.product_name ?? 'Produkt'} x{item.quantity}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">{item.price * item.quantity} kr</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex justify-between">
            <span className="font-semibold text-gray-900 dark:text-white">Totalt</span>
            <span className="font-bold text-amber-600">{order.total} kr</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Betalningsstatus:</strong> Din betalning kontrolleras av oss. Vi markerar ordern som betald när vi bekräftat Swish-betalningen.
          </p>
          {order.swish_number && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Swisha <strong>{order.total} kr</strong> till <strong>{order.swish_number}</strong> och ange ordernummer <strong>{order.order_number}</strong> som meddelande.
            </p>
          )}
        </div>

        {order.tracking_number && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start gap-3">
            <Truck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Din order är skickad</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Spårningsnummer: {order.tracking_number}
                {order.carrier ? ` (${order.carrier})` : ''}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <div className="text-center mt-8">
        <Link to="/produkter">
          <Button>
            Fortsätt handla <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
