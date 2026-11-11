import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'

interface ErrorPageProps {
  title?: string
  message?: string
}

export function ErrorPage({ title = 'Något gick fel', message = 'Ett oväntat fel inträffade. Försök igen senare.' }: ErrorPageProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900  mb-3">{title}</h1>
        <p className="text-gray-600  mb-8">{message}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300  rounded-lg text-gray-700  hover:bg-gray-50  transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Gå tillbaka
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Home className="w-4 h-4" /> Hem
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <h1 className="text-8xl font-bold text-amber-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900  mb-3">Sidan hittades inte</h2>
        <p className="text-gray-600  mb-8">
          Sidan du letar efter finns inte eller har flyttats.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Home className="w-4 h-4" /> Tillbaka till hem
        </button>
      </motion.div>
    </div>
  )
}
