import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { getSetting, setSetting } from '../../services/settings'

export function AdminSettingsPage() {
  const queryClient = useQueryClient()
  const [value, setValue] = useState('')

  const { data: swishNumber, isLoading } = useQuery({
    queryKey: ['admin-settings', 'swish_number'],
    queryFn: () => getSetting('swish_number'),
  })

  useEffect(() => {
    if (swishNumber) setValue(swishNumber)
  }, [swishNumber])

  const mutation = useMutation({
    mutationFn: (next: string) => setSetting('swish_number', next),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      queryClient.invalidateQueries({ queryKey: ['settings', 'swish_number'] })
      toast.success('Inställningar sparade')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Inställningar</h2>

      <div className="max-w-xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Betalning</h3>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 w-32 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              mutation.mutate(value.trim())
            }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Swish-nummer
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0701234567"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Numret som visas i kassan och i orderbekräftelsen.
            </p>
            <button
              type="submit"
              disabled={mutation.isPending || !value.trim()}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" /> Spara
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
