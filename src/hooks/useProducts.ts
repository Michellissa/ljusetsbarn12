import { useQuery } from '@tanstack/react-query'
import { getProducts, getProductBySlug, getRelatedProducts } from '../services/products'

export function useProducts(options?: {
  categoryId?: string
  limit?: number
  featured?: boolean
  search?: string
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['products', options],
    queryFn: () => getProducts(options),
  })
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductBySlug(id!),
    enabled: !!id,
  })
}

export function useRelatedProducts(categoryId: string | undefined, excludeId: string) {
  return useQuery({
    queryKey: ['related-products', categoryId, excludeId],
    queryFn: () => getRelatedProducts(categoryId!, excludeId),
    enabled: !!categoryId,
  })
}
