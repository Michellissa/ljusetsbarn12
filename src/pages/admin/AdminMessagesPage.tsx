import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Mail, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { getMessages, deleteMessage } from '../../services/messages'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useState } from 'react'

export function AdminMessagesPage() {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: getMessages,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] })
      toast.success('Meddelande borttaget')
      setDeleting(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900  mb-6">Meddelanden</h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100  rounded-lg animate-pulse" />
          ))}
        </div>
      ) : messages && messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white  rounded-xl border border-gray-200  overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50  transition-colors"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="font-medium text-gray-900  truncate">
                      {msg.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{msg.name}</span>
                    <span>•</span>
                    <span>{msg.email}</span>
                    <span>•</span>
                    <span>{new Date(msg.created_at).toLocaleDateString('sv-SE', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleting(msg.id) }}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expanded === msg.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>
              {expanded === msg.id && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-200 ">
                  <p className="text-sm text-gray-700  whitespace-pre-wrap mt-3">
                    {msg.message}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300 " />
          <p>Inga meddelanden än</p>
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Ta bort meddelande"
        message="Är du säker? Det går inte att ångra."
        confirmLabel="Ta bort"
        onConfirm={() => deleting && deleteMutation.mutate(deleting)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
