import { SITE_NAME, SITE_URL } from '../lib/constants'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

export function generateMetaTags({ title, description, image, url, type = 'website' }: SEOProps = {}) {
  const siteTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const desc = description ?? 'Presenter, inredning och produkter som sprider glädje.'
  const img = image ?? '/og-image.jpg'
  const pageUrl = url ?? SITE_URL

  return {
    title: siteTitle,
    meta: [
      { name: 'description', content: desc },
      { property: 'og:title', content: siteTitle },
      { property: 'og:description', content: desc },
      { property: 'og:image', content: img },
      { property: 'og:url', content: pageUrl },
      { property: 'og:type', content: type },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: siteTitle },
      { name: 'twitter:description', content: desc },
      { name: 'twitter:image', content: img },
    ],
  }
}

export function generateStructuredData(type: 'Store' | 'Product' | 'BreadcrumbList', data: Record<string, unknown>) {
  const base = { '@context': 'https://schema.org' }

  switch (type) {
    case 'Store':
      return {
        ...base,
        '@type': 'Store',
        name: SITE_NAME,
        description: 'Presenter, inredning och produkter som sprider glädje.',
        url: SITE_URL,
        ...data,
      }
    case 'Product':
      return {
        ...base,
        '@type': 'Product',
        ...data,
      }
    case 'BreadcrumbList':
      return {
        ...base,
        '@type': 'BreadcrumbList',
        itemListElement: data.items,
      }
  }
}
