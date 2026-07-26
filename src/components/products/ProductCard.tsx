import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import type { Product } from '../../types'
import { useFavorites } from '../../contexts/FavoritesContext'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(product.id)
  const inStock = product.stock > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/produkter/${product.id}`}
        className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-amber-200 dark:hover:border-amber-800 transition-all duration-300"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite(product.id)
            }}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all',
              favorited
                ? 'bg-amber-600 text-white'
                : 'bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-400 hover:bg-amber-600 hover:text-white'
            )}
            aria-label={favorited ? 'Ta bort från favoriter' : 'Lägg till i favoriter'}
          >
            <Heart className={cn('w-4 h-4', favorited && 'fill-current')} />
          </button>
          {!inStock && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="danger">Slut i lager</Badge>
            </div>
          )}
          {product.featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="warning">Nyhet</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {product.category?.name ?? 'Övrigt'}
          </p>
          <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-amber-600">
              {product.price} kr
            </span>
            {inStock && (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <ShoppingBag className="w-3 h-3" />
                I lager
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
