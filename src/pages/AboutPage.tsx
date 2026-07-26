import { motion } from 'framer-motion'

export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Om oss
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
            alt="Ljusets Barn butik"
            className="w-full h-[400px] object-cover rounded-xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Vår historia
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Ljusets Barn startade med en enkel idé: att skapa en plats där människor kan hitta
            produkter som sprider glädje och värme. Vår butik erbjuder ett noggrant utvalt sortiment
            av presenter, inredning, smycken och dekorationer.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Vi tror på kvalitet framför kvantitet. Varje produkt i vårt sortiment är handplockad
            för att säkerställa att den uppfyller våra höga krav på design, hållbarhet och
            funktionalitet.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Välkommen till Ljusets Barn - där varje produkt har en historia att berätta.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        {[
          { value: '500+', label: 'Produkter' },
          { value: '6', label: 'Kategorier' },
          { value: '100%', label: 'Kvalitet' },
        ].map((stat, i) => (
          <div
            key={i}
            className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl"
          >
            <div className="text-4xl font-bold text-amber-600 mb-2">{stat.value}</div>
            <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
          alt="Inredning"
          className="w-full h-64 object-cover rounded-xl"
        />
        <img
          src="https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&q=80"
          alt="Presenter"
          className="w-full h-64 object-cover rounded-xl"
        />
      </motion.div>
    </div>
  )
}
