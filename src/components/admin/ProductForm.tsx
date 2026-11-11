import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Product, Category } from '../../types'
import { Button } from '../ui/Button'
import { useState } from 'react'

const productSchema = z.object({
  name: z.string().min(1, 'Namn krävs'),
  description: z.string().min(10, 'Beskrivning måste vara minst 10 tecken'),
  price: z.coerce.number().min(1, 'Pris måste vara större än 0'),
  stock: z.coerce.number().min(0, 'Lager kan inte vara negativt'),
  featured: z.boolean(),
  category_id: z.string().min(1, 'Kategori krävs'),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product | null
  categories: Category[]
  onSave: (data: ProductFormData & { imageFile?: File }) => void
  onCancel: () => void
  saving: boolean
}

export function ProductForm({ product, categories, onSave, onCancel, saving }: ProductFormProps) {
  const [imageFile, setImageFile] = useState<File | undefined>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          featured: product.featured,
          category_id: product.category_id,
        }
      : {
          name: '',
          description: '',
          price: 0,
          stock: 0,
          featured: false,
          category_id: '',
        },
  })

  const onSubmit = (data: ProductFormData) => {
    onSave({ ...data, imageFile })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white  rounded-xl border border-gray-200  p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700  mb-1">Namn</label>
          <input
            {...register('name')}
            className="w-full px-4 py-2.5 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700  mb-1">Kategori</label>
          <select
            {...register('category_id')}
            className="w-full px-4 py-2.5 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Välj kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="text-sm text-red-600 mt-1">{errors.category_id.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700  mb-1">Pris (kr)</label>
          <input
            type="number"
            {...register('price')}
            className="w-full px-4 py-2.5 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700  mb-1">Lagersaldo</label>
          <input
            type="number"
            {...register('stock')}
            className="w-full px-4 py-2.5 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700  mb-1">Beskrivning</label>
        <textarea
          rows={4}
          {...register('description')}
          className="w-full px-4 py-2.5 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
        />
        {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700  mb-1">Bild</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0])}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50  file:text-amber-600 hover:file:bg-amber-100"
        />
        {product?.image_url && !imageFile && (
          <img src={product.image_url} alt="" className="w-20 h-20 rounded-lg object-cover mt-2" />
        )}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('featured')}
          className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
        />
        <span className="text-sm text-gray-700 ">Nyhet / Utvald produkt</span>
      </label>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Avbryt</Button>
        <Button type="submit" loading={saving}>
          {product ? 'Uppdatera' : 'Skapa'} produkt
        </Button>
      </div>
    </form>
  )
}
