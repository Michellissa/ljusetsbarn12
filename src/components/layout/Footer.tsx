import { Link } from 'react-router-dom'
import { ShoppingBag, Mail, Phone, MapPin, Camera, Globe } from 'lucide-react'
import { SITE_NAME, CONTACT, SOCIAL, NAV_ITEMS } from '../../lib/constants'

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-6 h-6 text-amber-600" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {SITE_NAME} är en butik som erbjuder presenter, inredning och produkter som sprider glädje.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Kontakt
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{CONTACT.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <a href={`tel:${CONTACT.phone}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Följ oss
            </h3>
            <div className="flex gap-3">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-amber-600 hover:text-white transition-all"
              >
                <Camera className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-amber-600 hover:text-white transition-all"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                Öppettider
              </h4>
              <ul className="space-y-1">
                {CONTACT.hours.map((h) => (
                  <li key={h.day} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{h.day}</span>
                    <span>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  )
}
