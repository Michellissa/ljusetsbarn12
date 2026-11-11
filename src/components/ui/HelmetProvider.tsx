import { useEffect } from 'react'
import { SITE_NAME, SITE_DESCRIPTION } from '../../lib/constants'

export function HelmetProvider() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = '#C9A227'
    document.head.appendChild(meta)
    document.documentElement.lang = 'sv'
    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  return null
}

export function useSEO(title?: string, description?: string) {
  const siteTitle = SITE_NAME
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle

  useEffect(() => {
    document.title = fullTitle

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        if (name.startsWith('og:')) {
          el.setAttribute('property', name)
        } else {
          el.setAttribute('name', name)
        }
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description ?? SITE_DESCRIPTION)
    setMeta('og:title', fullTitle)
    setMeta('og:description', description ?? SITE_DESCRIPTION)
    setMeta('og:type', 'website')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description ?? SITE_DESCRIPTION)
  }, [fullTitle, description])
}
