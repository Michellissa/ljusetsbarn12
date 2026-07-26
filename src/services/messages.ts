import { supabase } from '../lib/supabase'
import type { ContactFormData, Message } from '../types'

export async function submitMessage(data: ContactFormData): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .insert([data])

  if (error) throw new Error(error.message)
}

export async function getMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as Message[]) ?? []
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
