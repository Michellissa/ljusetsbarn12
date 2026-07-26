export const SITE_NAME = 'Ljusets Barn'
export const SITE_DESCRIPTION = 'Presenter, inredning och produkter som sprider glädje.'
export const SITE_URL = 'https://ljusetsbarn.se'

export const CONTACT = {
  address: 'Storgatan 12, 123 45 Stockholm',
  phone: '+46 70 123 45 67',
  email: 'info@ljusetsbarn.se',
  hours: [
    { day: 'Måndag - Fredag', time: '10:00 - 18:00' },
    { day: 'Lördag', time: '10:00 - 15:00' },
    { day: 'Söndag', time: 'Stängt' },
  ],
  googleMapsUrl: 'https://maps.google.com/?q=Storgatan+12+Stockholm',
}

export const SOCIAL = {
  instagram: 'https://instagram.com/ljusetsbarn',
  facebook: 'https://facebook.com/ljusetsbarn',
  pinterest: 'https://pinterest.com/ljusetsbarn',
}

export const NAV_ITEMS = [
  { label: 'Hem', path: '/' },
  { label: 'Produkter', path: '/produkter' },
  { label: 'Kategorier', path: '/kategorier' },
  { label: 'Om oss', path: '/om-oss' },
  { label: 'Kontakt', path: '/kontakt' },
] as const
