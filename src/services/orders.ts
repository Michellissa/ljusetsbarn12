import { supabase } from '../lib/supabase'
import type { Order, OrderItem, OrderFormData } from '../types'

export async function createOrder(
  formData: OrderFormData,
  items: { product_id: string; quantity: number; price: number }[],
  total: number,
  swishNumber?: string
): Promise<Order> {
  const { data: order, error } = await supabase
    .from('orders')
    .insert([{ ...formData, total, swish_number: swishNumber ?? null, status: 'vantar_betalning' }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  const orderId = (order as Order).id

  const orderItems = items.map((item) => ({ ...item, order_id: orderId }))
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw new Error(itemsError.message)

  return order as Order
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as Order[]) ?? []
}

export async function getOrder(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Order
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*, product:products(*)')
    .eq('order_id', orderId)

  if (error) throw new Error(error.message)
  return (data as OrderItem[]) ?? []
}
