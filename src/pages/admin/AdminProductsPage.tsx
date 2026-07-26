import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { createProduct, updateProduct, deleteProduct, uploadProductImage } from '../../services/products'
import { getCategories } from '../../services/categories'
import type { Product } from '../../types'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Badge } from '../../components/ui/Badge'
import { ProductForm } from '../../components/admin/ProductForm'

export function AdminProductsPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const queryClient = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false })
      return (data as Product[]) ?? []
    },
  })

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getCategories,
  })

  const createMutation = useMutation({
    mutationFn: async ({ product, imageFile }: { product: Parameters<typeof createProduct>[0]; imageFile?: File }) => {
      let image_url = ''
      if (imageFile) {
        image_url = await uploadProductImage(imageFile)
      }
      return createProduct({ ...product, image_url })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Produkt skapad!')
      setFormOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, product }: { id: string; product: Partial<Product> }) => updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Produkt uppdaterad!')
      setEditing(null)
      setFormOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Produkt borttagen!')
      setDeleting(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleSave = async (data: Partial<Product> & { imageFile?: File }) => {
    const { imageFile, ...productData } = data
    if (editing) {
      const updateData: Partial<Product> = { ...productData }
      if (imageFile) {
        updateData.image_url = await uploadProductImage(imageFile)
      }
      updateMutation.mutate({ id: editing.id, product: updateData })
    } else {
      createMutation.mutate({ product: productData as Parameters<typeof createProduct>[0], imageFile })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Produkter</h2>
        <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
          <Plus className="w-4 h-4" /> Lägg till produkt
        </Button>
      </div>

      {formOpen && (
        <div className="mb-8">
          <ProductForm
            product={editing}
            categories={categories ?? []}
            onSave={handleSave}
            onCancel={() => { setFormOpen(false); setEditing(null) }}
            saving={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Produkt</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Kategori</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Pris</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Lager</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.description.slice(0, 50)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{product.category?.name ?? '-'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{product.price} kr</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {product.stock > 5 ? (
                      <Badge variant="success">{product.stock} st</Badge>
                    ) : product.stock > 0 ? (
                      <Badge variant="warning">{product.stock} st</Badge>
                    ) : (
                      <Badge variant="danger">Slut</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditing(product); setFormOpen(true) }}
                        className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(product)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">Inga produkter än</div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Ta bort produkt"
        message={`Är du säker på att du vill ta bort "${deleting?.name}"?`}
        confirmLabel="Ta bort"
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
