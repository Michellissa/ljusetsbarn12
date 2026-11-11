import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categories'
import type { Category, CategoryFormData } from '../../types'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

export function AdminCategoriesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getCategories,
  })

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Kategori skapad!')
      resetForm()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Kategori uppdaterad!')
      resetForm()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Kategori borttagen!')
      setDeleting(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const resetForm = () => {
    setFormOpen(false)
    setEditing(null)
    setName('')
    setSlug('')
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setName(cat.name)
    setSlug(cat.slug)
    setFormOpen(true)
  }

  const handleSave = () => {
    if (!name.trim() || !slug.trim()) {
      toast.error('Namn och slug krävs')
      return
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: { name, slug } })
    } else {
      createMutation.mutate({ name, slug })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 ">Kategorier</h2>
        <Button onClick={() => { setEditing(null); setFormOpen(true); setName(''); setSlug('') }}>
          <Plus className="w-4 h-4" /> Lägg till kategori
        </Button>
      </div>

      {formOpen && (
        <div className="mb-8 bg-white  rounded-xl border border-gray-200  p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">Namn</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={resetForm}>Avbryt</Button>
            <Button onClick={handleSave} loading={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Uppdatera' : 'Skapa'}
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100  rounded-lg animate-pulse" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid gap-3">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-4 bg-white  rounded-xl border border-gray-200 "
            >
              <div>
                <p className="font-medium text-gray-900 ">{cat.name}</p>
                <p className="text-sm text-gray-500">/{cat.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleting(cat)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">Inga kategorier än</div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Ta bort kategori"
        message={`Är du säker på att du vill ta bort "${deleting?.name}"?`}
        confirmLabel="Ta bort"
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
