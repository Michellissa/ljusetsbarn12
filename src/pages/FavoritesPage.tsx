import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useFavorites } from '../contexts/FavoritesContext'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/products/ProductCard'
import { ProductGridSkeleton } from '../components/ui/LoadingSkeleton'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function FavoritesPage() {
  const { favorites } = useFavorites()
  const { data, isLoading } = useProducts({ limit: 100 })

  const favoriteProducts = data?.products.filter((p) => favorites.includes(p.id)) ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6 text-amber-600" />
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Favoriter
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {favoriteProducts.length} sparade produkter
        </p>
      </motion.div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Inga favoriter än
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Spara produkter du gillar genom att klicka på hjärtat.
          </p>
          <Link to="/produkter">
            <Button>Utforska produkter</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
