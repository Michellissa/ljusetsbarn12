import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Heart, ShoppingCart } from 'lucide-react'
import { useProduct, useRelatedProducts } from '../hooks/useProducts'
import { ImageZoom } from '../components/ui/ImageZoom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ProductCarousel } from '../components/products/ProductCarousel'
import { Skeleton } from '../components/ui/LoadingSkeleton'
import { NotFoundPage } from '../components/ui/ErrorPage'
import { useFavorites } from '../contexts/FavoritesContext'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'
import { cn } from '../utils/cn'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading } = useProduct(id)
  const { data: related } = useRelatedProducts(product?.category_id, id ?? '')
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return <NotFoundPage />

  const images = product.image_urls?.length ? product.image_urls.filter(Boolean) : ([product.image_url].filter(Boolean) as string[])
  const inStock = product.stock > 0
  const favorited = isFavorite(product.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Link
        to="/produkter"
        className="inline-flex items-center gap-2 text-sm text-gray-600  hover:text-amber-600 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Tillbaka till produkter
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="rounded-xl overflow-hidden bg-gray-100  mb-4">
            <ImageZoom
              src={images[selectedImage] || '/placeholder.svg'}
              alt={product.name}
              className="aspect-square"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                    i === selectedImage
                      ? 'border-amber-600'
                      : 'border-transparent hover:border-gray-300 '
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            {product.category && (
              <Link
                to={`/produkter?kategori=${product.category.slug}`}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900  mt-1">
              {product.name}
            </h1>
          </div>

          <p className="text-3xl font-bold text-amber-600">{product.price} kr</p>

          <div className="flex items-center gap-3">
            {inStock ? (
              <Badge variant="success">I lager ({product.stock} st)</Badge>
            ) : (
              <Badge variant="danger">Slut i lager</Badge>
            )}
            {product.featured && <Badge variant="warning">Nyhet</Badge>}
          </div>

          <p className="text-gray-600  leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-3">
            <Button
              variant={inStock ? 'primary' : 'outline'}
              size="lg"
              disabled={!inStock}
              onClick={() => { addItem(product); toast.success(`${product.name} tillagd i varukorgen`) }}
            >
              <ShoppingCart className="w-5 h-5" />
              {inStock ? 'Lägg i varukorg' : 'Tillfälligt slut'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => toggleFavorite(product.id)}
              className={cn(favorited && 'border-amber-600 text-amber-600')}
            >
              <Heart className={cn('w-5 h-5', favorited && 'fill-current')} />
              {favorited ? 'Sparad' : 'Spara'}
            </Button>
          </div>
        </motion.div>
      </div>

      {related && related.length > 0 && (
        <div className="mt-16">
          <ProductCarousel title="Relaterade produkter" products={related} />
        </div>
      )}
    </div>
  )
}
