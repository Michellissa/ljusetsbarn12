import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Tags } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'
import { Skeleton } from '../components/ui/LoadingSkeleton'
import { ErrorPage } from '../components/ui/ErrorPage'

const categoryImages: Record<string, string> = {
  smycken: 'https://images.unsplash.com/photo-1601121140229-5e7a94f9ec9a?w=600&q=80',
  presenter: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&q=80',
  inredning: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&q=80',
  dekoration: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600&q=80',
  ljus: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80',
}

export function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories()

  if (error) return <ErrorPage message="Kunde inte ladda kategorier." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Tags className="w-6 h-6 text-amber-600" />
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Kategorier
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Utforska våra produktkategorier
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/produkter?kategori=${cat.slug}`}
                className="group relative block aspect-[4/3] rounded-xl overflow-hidden"
              >
                <img
                  src={categoryImages[cat.slug] ?? 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                  <span className="inline-flex items-center gap-1 text-sm text-amber-400 group-hover:gap-2 transition-all">
                    Utforska <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Inga kategorier hittades.</p>
        </div>
      )}
    </div>
  )
}
