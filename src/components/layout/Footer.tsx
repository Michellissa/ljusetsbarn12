import { Link } from 'react-router-dom'
import { Mail, Phone, Camera } from 'lucide-react'
import { SITE_NAME, SITE_DESCRIPTION, CONTACT, SOCIAL, NAV_ITEMS } from '../../lib/constants'

export function Footer() {
  return (
    <footer className="bg-gray-50  border-t border-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Ljusets Barn" className="h-10 w-10 object-contain" />
              <span className="text-lg font-semibold text-gray-900 ">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-gray-600  leading-relaxed">
              {SITE_DESCRIPTION}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900  uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-600  hover:text-amber-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900  uppercase tracking-wider mb-4">
              Kontakt
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <a href={`tel:${CONTACT.phone}`} className="text-sm text-gray-600  hover:text-amber-600 transition-colors">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="text-sm text-gray-600  hover:text-amber-600 transition-colors">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900  uppercase tracking-wider mb-4">
              Följ oss
            </h3>
            <div className="flex gap-3">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200  flex items-center justify-center text-gray-600  hover:bg-amber-600 hover:text-white transition-all"
              >
                <Camera className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 ">
          <p className="text-center text-sm text-gray-500 ">
            &copy; {new Date().getFullYear()} {SITE_NAME}. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  )
}
