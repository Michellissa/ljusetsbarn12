import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShoppingBag, CreditCard, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../contexts/CartContext'
import { createOrder, sendOrderEmail, updateOrderDetails } from '../services/orders'
import { getSetting } from '../services/settings'
import { Button } from '../components/ui/Button'
import { useQuery } from '@tanstack/react-query'
import type { OrderFormData, CreateOrderResult } from '../types'

const checkoutSchema = z.object({
  customer_name: z.string().min(1, 'Namn krävs'),
  phone: z.string().min(6, 'Ange ett giltigt telefonnummer'),
  email: z.string().email('Ange en giltig e-postadress'),
  address: z.string().min(1, 'Adress krävs'),
  city: z.string().min(1, 'Stad krävs'),
  postal_code: z.string().min(3, 'Ange ett giltigt postnummer'),
  message: z.string().optional(),
})

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const [step, setStep] = useState<'form' | 'payment'>('form')
  const [createdOrder, setCreatedOrder] = useState<CreateOrderResult | null>(null)
  const [creating, setCreating] = useState(false)

  const { data: swishNumber } = useQuery({
    queryKey: ['settings', 'swish_number'],
    queryFn: () => getSetting('swish_number'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const orderTotal = createdOrder?.total ?? total

  const qrCodeUrl = useMemo(() => {
    if (!swishNumber || orderTotal <= 0 || !createdOrder) return ''
    const message = encodeURIComponent(createdOrder.order_number)
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Swish%3A${swishNumber}%3B${orderTotal}%3B${message}`
  }, [swishNumber, orderTotal, createdOrder])

  if (items.length === 0 && step === 'form') {
    navigate('/varukorg')
    return null
  }

  const onFormSubmit = async (data: OrderFormData) => {
    setCreating(true)
    try {
      if (createdOrder) {
        await updateOrderDetails(createdOrder.access_token, data)
      } else {
        const order = await createOrder(
          data,
          items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
          }))
        )
        setCreatedOrder(order)
        void sendOrderEmail(order.access_token).catch(() => {})
      }
      setStep('payment')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Kunde inte skapa beställningen. Försök igen.')
    } finally {
      setCreating(false)
    }
  }

  const handleConfirmPayment = () => {
    if (!createdOrder) return
    clearCart()
    navigate(`/orderbekraftelse/${createdOrder.access_token}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Kassa</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {step === 'form' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Kunduppgifter</h2>
                </div>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Namn</label>
                      <input {...register('customer_name')} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      {errors.customer_name && <p className="text-sm text-red-600 mt-1">{errors.customer_name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefon</label>
                      <input {...register('phone')} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-post</label>
                      <input {...register('email')} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adress</label>
                      <input {...register('address')} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postnummer</label>
                      <input {...register('postal_code')} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      {errors.postal_code && <p className="text-sm text-red-600 mt-1">{errors.postal_code.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stad</label>
                      <input {...register('city')} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meddelande (valfritt)</label>
                      <textarea rows={3} {...register('message')} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
                    </div>
                  </div>
                  <Button type="submit" loading={creating} className="w-full">
                    Gå till betalning
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Betala med Swish</h2>
                </div>

                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Ordernummer
                  </p>
                  <p className="text-lg font-semibold text-amber-600 mb-4">
                    {createdOrder?.order_number}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Swisha <strong className="text-amber-600">{orderTotal} kr</strong> till
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {swishNumber ?? 'Ej konfigurerat'}
                  </p>
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="Swish QR-kod"
                      className="w-48 h-48 mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  )}
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Så här betalar du:</h3>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
                    <li>Öppna Swish-appen</li>
                    <li>Betala <strong>{orderTotal} kr</strong> till <strong>{swishNumber ?? 'Ej konfigurerat'}</strong></li>
                    <li>Ange <strong>{createdOrder?.order_number}</strong> som meddelande</li>
                    <li>Klicka på "Jag har betalat" nedan</li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={() => setStep('form')} className="flex-1">
                    Tillbaka
                  </Button>
                  <Button
                    onClick={handleConfirmPayment}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4" /> Jag har betalat
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Orderöversikt</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img src={item.product.image_url || '/placeholder.svg'} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} st x {item.product.price} kr</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.product.price * item.quantity} kr</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Totalt</span>
                <span>{orderTotal} kr</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">inkl. moms</p>
              <p className="text-xs text-gray-500 mt-3">
                Vi fraktar inom Sverige och EU. Vi ansvarar inte för hur Posten hanterar leveransen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
