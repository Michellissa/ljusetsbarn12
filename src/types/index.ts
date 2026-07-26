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
  images?: string[]
  stock: number
  featured: boolean
  category_id: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  stock: number
  featured: boolean
  category_id: string
  images: string[]
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
  lowStockProducts: Product[]
  recentProducts: Product[]
}
