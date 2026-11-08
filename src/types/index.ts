export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  image_urls: string[]
  stock: number
  featured: boolean
  category_id: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderFormData {
  customer_name: string
  phone: string
  email: string
  address: string
  city: string
  postal_code: string
  message?: string
}

export interface Order {
  id: string
  order_number: string
  access_token: string
  customer_name: string
  phone: string
  email: string
  address: string
  city: string
  postal_code: string
  message: string
  status: string
  total: number
  swish_number: string | null
  tracking_number: string | null
  carrier: string | null
  shipped_at: string | null
  paid_at: string | null
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string | null
  quantity: number
  price: number
  product?: Product
}

export interface CreateOrderItemInput {
  product_id: string
  quantity: number
}

export interface CreateOrderResult {
  id: string
  order_number: string
  access_token: string
  total: number
}

export type OrderStatus = 'ny' | 'vantar_betalning' | 'betald' | 'packas' | 'skickad' | 'klar'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  ny: 'Ny',
  vantar_betalning: 'Väntar på betalning',
  betald: 'Betald',
  packas: 'Packas',
  skickad: 'Skickad',
  klar: 'Klar',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  ny: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  vantar_betalning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  betald: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  packas: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  skickad: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  klar: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export interface PaymentService {
  name: string
  processPayment(orderId: string, total: number): Promise<{ success: boolean; redirectUrl?: string }>
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  stock: number
  featured: boolean
  category_id: string
  image_urls: string[]
}

export interface CategoryFormData {
  name: string
  slug: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export interface AdminStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalRevenue: number
  lowStockProducts: Product[]
  recentProducts: Product[]
  recentOrders: Order[]
}
