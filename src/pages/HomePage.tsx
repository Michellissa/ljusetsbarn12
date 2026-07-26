import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ProductCarousel } from '../components/products/ProductCarousel'
import { ProductGridSkeleton } from '../components/ui/LoadingSkeleton'
import { useProducts } from '../hooks/useProducts'

export function HomePage() {
  const { data: featuredData, isLoading: featuredLoading } = useProducts({ featured: true, limit: 8 })
  const { data: recentData, isLoading: recentLoading } = useProducts({ limit: 8 })

  return (
    <>
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80"
            alt="Ljusets Barn"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left lg:self-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Välkommen till vår butik
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Ljusets Barn
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl">
              Presenter, inredning och produkter som sprider glädje.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/produkter">
                <Button size="lg" className="w-full sm:w-auto">
                  Se produkter <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/kontakt">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/20">
                  Kontakta oss
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {featuredLoading ? (
          <ProductGridSkeleton count={4} />
        ) : featuredData?.products ? (
          <ProductCarousel title="Nyheter" products={featuredData.products} />
        ) : null}

        {recentLoading ? (
          <ProductGridSkeleton count={4} />
        ) : recentData?.products ? (
          <ProductCarousel title="Senast tillagda" products={recentData.products} />
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            to="/produkter"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            Visa alla produkter <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </>
  )
}
