import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900  mb-2">
          Om oss
        </h1>
        <p className="text-gray-600 ">
          Handgjort hantverk och personliga gåvor.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <img
            src="/images/ljusetsbarn/image18.jpg"
            alt="Broderad dophandduk"
            className="w-full h-[400px] object-cover rounded-xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 ">
            Vår historia
          </h2>
          <p className="text-gray-600  leading-relaxed">
            Ljusets Barn brinner för handarbete och personliga gåvor – särskilt
            broderade dophanddukar och produkter i plexi.
          </p>
          <p className="text-gray-600  leading-relaxed">
            Varje dophandduk broderas för hand efter namn och datum. Vi lägger tid på
            detaljerna och vill att varje produkt ska kännas personlig och hålla
            länge.
          </p>
          <p className="text-gray-600  leading-relaxed">
            Vi skickar inom hela Sverige och EU. Hör av dig online så hjälper vi
            dig.
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
          { value: 'Handgjort', label: 'Hantverk' },
          { value: 'Personlig', label: 'Brodyr' },
          { value: 'SE & EU', label: 'Frakt' },
        ].map((stat, i) => (
          <div
            key={i}
            className="text-center p-8 bg-gray-50  rounded-xl"
          >
            <div className="text-4xl font-bold text-amber-600 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 ">{stat.label}</div>
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
          src="/images/ljusetsbarn/image22.jpg"
          alt="Handgjord plexi"
          className="w-full h-64 object-cover rounded-xl"
        />
        <img
          src="/images/ljusetsbarn/image16.jpg"
          alt="Handgjort smycke"
          className="w-full h-64 object-cover rounded-xl"
        />
      </motion.div>

      <div className="mt-12 text-center">
        <Link to="/produkter">
          <Button size="lg">
            Se våra produkter <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
