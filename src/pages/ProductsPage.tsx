import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { ProductCard } from '../components/products/ProductCard'
import { ProductGridSkeleton } from '../components/ui/LoadingSkeleton'
import { ErrorPage } from '../components/ui/ErrorPage'
import { Button } from '../components/ui/Button'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const activeCategory = searchParams.get('kategori') ?? undefined
  const search = searchParams.get('s') ?? undefined

  const { data, isLoading, error } = useProducts({
    categoryId: activeCategory,
    search,
    page,
    pageSize: 12,
  })
  const { data: categories } = useCategories()

  const totalPages = data?.count ? Math.ceil(data.count / 12) : 1

  const handleCategoryFilter = (slug: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (slug) {
      params.set('kategori', slug)
    } else {
      params.delete('kategori')
    }
    setSearchParams(params)
    setPage(1)
  }

  if (error) return <ErrorPage message="Kunde inte ladda produkter." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900  mb-2">
          {search ? `Sökresultat för "${search}"` : 'Produkter'}
        </h1>
        <p className="text-gray-600  mb-8">
          {data?.count ?? 0} produkter
          {search && ` hittades för "${search}"`}
        </p>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Filter className="w-4 h-4 text-gray-500" />
        <button
          onClick={() => handleCategoryFilter(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !activeCategory
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100  text-gray-700  hover:bg-gray-200 '
          }`}
        >
          Alla
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryFilter(cat.slug)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100  text-gray-700  hover:bg-gray-200 '
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : data?.products && data.products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Föregående
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'primary' : 'outline'}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Nästa
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500  text-lg">Inga produkter hittades.</p>
        </div>
      )}
    </div>
  )
}
