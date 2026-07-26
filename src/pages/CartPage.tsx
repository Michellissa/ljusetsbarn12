import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { Button } from '../components/ui/Button'

export function CartPage() {
  const { items, removeItem, updateQuantity, itemCount, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Varukorgen är tom</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Lägg till produkter för att fortsätta.</p>
          <Link to="/produkter">
            <Button>Handla nu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Varukorg</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{itemCount} produkter</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <Link to={`/produkter/${item.product.id}`} className="flex-shrink-0">
                <img
                  src={item.product.image_url || '/placeholder.svg'}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/produkter/${item.product.id}`}>
                  <h3 className="font-medium text-gray-900 dark:text-white hover:text-amber-600 transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-amber-600 font-semibold mt-1">{item.product.price} kr</p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="ml-auto text-sm text-gray-500">
                    {item.product.price * item.quantity} kr
                  </span>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ordersammanfattning</h3>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-gray-600 dark:text-gray-400">
                <span className="truncate mr-2">{item.product.name} x{item.quantity}</span>
                <span>{item.product.price * item.quantity} kr</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
              <span>Totalt</span>
              <span>{total} kr</span>
            </div>
          </div>
          <Link to="/kassa" className="block mt-6">
            <Button className="w-full">
              Gå till kassan <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
