import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Camera,
  HeartHandshake,
  Mail,
  PackageCheck,
  PenLine,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ProductCarousel } from '../components/products/ProductCarousel'
import { ProductGridSkeleton, Skeleton } from '../components/ui/LoadingSkeleton'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { categoryImages, categoryOrder } from '../lib/categoryImages'
import { CONTACT, SOCIAL } from '../lib/constants'

const trustItems = [
  { icon: HeartHandshake, label: 'Handgjort med omsorg' },
  { icon: ShieldCheck, label: 'Swish-betalning' },
  { icon: Truck, label: 'Frakt inom Sverige & EU' },
  { icon: Sparkles, label: 'Personlig brodyr' },
]

const steps = [
  {
    icon: PenLine,
    title: 'Välj produkt',
    text: 'Välj en dophandduk eller annan produkt som du vill ha.',
  },
  {
    icon: Scissors,
    title: 'Ange namn & datum',
    text: 'Hör av dig med namn, datum och eventuellt motiv.',
  },
  {
    icon: PackageCheck,
    title: 'Vi broderar & skickar',
    text: 'Vi broderar för hand och skickar inom Sverige och EU.',
  },
]

const infoItems = [
  {
    icon: ShieldCheck,
    title: 'Swish-betalning',
    text: 'Betala enkelt och säkert med Swish. Du får ordernummer och betalningsinstruktioner direkt.',
  },
  {
    icon: Truck,
    title: 'Frakt inom Sverige & EU',
    text: 'Vi packar och skickar med spårning. Vi ansvarar inte för hur Posten hanterar leveransen.',
  },
  {
    icon: HeartHandshake,
    title: 'Personlig service',
    text: 'Har du frågor om brodyr eller en personlig beställning? Hör av dig så hjälper vi dig.',
  },
]

export function HomePage() {
  const { data: featuredData, isLoading: featuredLoading } = useProducts({
    featured: true,
    limit: 8,
  })
  const { data: recentData, isLoading: recentLoading } = useProducts({ limit: 8 })
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  const featuredEmpty =
    !featuredLoading && (featuredData?.products.length ?? 0) === 0
  const highlightProducts = featuredEmpty
    ? recentData?.products ?? []
    : featuredData?.products ?? []
  const highlightLoading = featuredLoading || (featuredEmpty && recentLoading)

  const orderedCategories = (categories ?? [])
    .filter(
      (cat) => !['presenter', 'inredning', 'ovrigt'].includes(cat.slug)
    )
    .slice()
    .sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.slug)
      const bIndex = categoryOrder.indexOf(b.slug)
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex)
    })
    .slice(0, 8)

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-100   ">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl " />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl " />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100  text-amber-700  text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                Handgjort med omsorg
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900  mb-6 leading-tight">
                Handbroderade dophanddukar & handgjort hantverk
              </h1>
              <p className="text-lg text-gray-600  mb-8 max-w-xl">
                Personliga dopgåvor, plexi och dekoration – tillverkat för hand.
                Vi broderar efter namn och datum och skickar inom hela Sverige och
                EU.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/produkter?kategori=dophanddukar">
                  <Button size="lg" className="w-full sm:w-auto">
                    Handla dophanddukar <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/produkter">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Se alla produkter
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 ">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Swish-betalning
                </span>
                <span className="inline-flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600" />
                  Frakt inom Sverige & EU
                </span>
                <span className="inline-flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-amber-600" />
                  Personlig service
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src="/images/ljusetsbarn/image18.jpg"
                alt="Broderad dophandduk"
                className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg"
              />
              <div className="space-y-4 pt-8">
                <img
                  src="/images/ljusetsbarn/image22.jpg"
                  alt="Handgjord plexi"
                  className="w-full aspect-square object-cover rounded-2xl shadow-lg"
                />
                <img
                  src="/images/ljusetsbarn/image16.jpg"
                  alt="Handgjort smycke"
                  className="w-full aspect-square object-cover rounded-2xl shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200  bg-white/70 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 text-sm text-gray-700 "
            >
              <item.icon className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between gap-4 mb-8"
        >
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 ">
              Utforska kategorierna
            </h2>
            <p className="text-gray-600  mt-2">
              Hitta rätt bland dophanddukar, plexi, smycken och mer.
            </p>
          </div>
          <Link
            to="/kategorier"
            className="hidden sm:inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            Alla kategorier <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : orderedCategories.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {orderedCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/produkter?kategori=${cat.slug}`}
                  className="group relative block aspect-[4/3] rounded-xl overflow-hidden"
                >
                  <img
                    src={categoryImages[cat.slug] ?? '/placeholder.svg'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base lg:text-lg font-bold text-white">
                      {cat.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm text-amber-400 group-hover:gap-2 transition-all">
                      Utforska <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {highlightLoading ? (
          <ProductGridSkeleton count={4} />
        ) : highlightProducts.length > 0 ? (
          <ProductCarousel title="Utvalda produkter" products={highlightProducts} />
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            to="/produkter"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            Visa alla produkter <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      <section className="bg-amber-50/70  border-y border-amber-100  py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center mb-10"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 ">
              Personlig brodyr – så funkar det
            </h2>
            <p className="text-gray-600  mt-3">
              Vi broderar dophanddukar efter namn, datum och motiv. Hör av dig så
              hjälper vi dig att skapa en personlig gåva.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white  rounded-xl border border-gray-200  p-6"
              >
                <div className="w-11 h-11 rounded-lg bg-amber-100  flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900  mb-2">
                  {i + 1}. {step.title}
                </h3>
                <p className="text-sm text-gray-600 ">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/kontakt">
              <Button size="lg">
                Beställ personligt <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <img
              src="/images/ljusetsbarn/image18.jpg"
              alt="Broderad dophandduk"
              className="w-full aspect-[3/4] object-cover rounded-2xl"
            />
            <img
              src="/images/ljusetsbarn/image6.jpg"
              alt="Handgjord dekoration"
              className="w-full aspect-[3/4] object-cover rounded-2xl mt-8"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900  mb-4">
              Handgjort med omsorg
            </h2>
            <p className="text-gray-600  mb-4 leading-relaxed">
              Ljusets Barn brinner för handarbete och personliga gåvor – särskilt
              broderade dophanddukar och produkter i plexi.
            </p>
            <p className="text-gray-600  mb-6 leading-relaxed">
              Varje dophandduk broderas för hand efter namn och datum. Vi lägger tid
              på detaljerna och vill att varje produkt ska kännas personlig och hålla
              länge.
            </p>
            <Link
              to="/om-oss"
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              Läs mer om oss <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="bg-gray-50  border-y border-gray-200  py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infoItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white  rounded-xl border border-gray-200  p-6"
              >
                <div className="w-11 h-11 rounded-lg bg-amber-100  flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900  mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 ">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl bg-gray-900  p-8 lg:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                Har du frågor eller vill beställa personligt?
              </h2>
              <p className="text-white/70 mb-6">
                Hör av dig till oss – vi hjälper dig med brodyr, storlekar och
                leverans.
              </p>
              <div className="space-y-3 text-sm">
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  {CONTACT.phone}
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  {CONTACT.email}
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Link to="/kontakt">
                <Button size="lg" className="w-full sm:w-auto">
                  Kontakta oss <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                >
                  <Camera className="w-4 h-4" /> Instagram
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
