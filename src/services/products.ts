import { supabase } from '../lib/supabase'
import type { Product } from '../types'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getProducts(options?: {
  categoryId?: string
  limit?: number
  featured?: boolean
  search?: string
  page?: number
  pageSize?: number
}): Promise<{ products: Product[]; count: number }> {
  let categoryUuid = options?.categoryId

  if (categoryUuid && !UUID_REGEX.test(categoryUuid)) {
    const { data } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categoryUuid)
      .single()
    categoryUuid = (data as { id: string } | null)?.id
  }

  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })

  if (categoryUuid) {
    query = query.eq('category_id', categoryUuid)
  }

  if (options?.featured !== undefined) {
    query = query.eq('featured', options.featured)
  }

  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`)
  }

  const page = options?.page ?? 1
  const pageSize = options?.pageSize ?? 12
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) throw new Error(error.message)
  return { products: (data as Product[]) ?? [], count: count ?? 0 }
}

export async function getProductBySlug(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Product
}

export async function getRelatedProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .limit(4)

  if (error) throw new Error(error.message)
  return (data as Product[]) ?? []
}

export async function createProduct(product: {
  name: string
  description: string
  price: number
  stock: number
  featured: boolean
  category_id: string
  image_url?: string
}): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select('*, category:categories(*)')
    .single()

  if (error) throw new Error(error.message)
  return data as Product
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select('*, category:categories(*)')
    .single()

  if (error) throw new Error(error.message)
  return data as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`
  const filePath = `products/${fileName}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  return publicUrl
}
