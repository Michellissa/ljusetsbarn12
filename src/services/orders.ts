import { supabase } from '../lib/supabase'
import type {
  Order,
  OrderItem,
  OrderFormData,
  CreateOrderItemInput,
  CreateOrderResult,
} from '../types'

export async function createOrder(
  formData: OrderFormData,
  items: CreateOrderItemInput[]
): Promise<CreateOrderResult> {
  const { data, error } = await supabase.rpc('create_order', {
    p_customer_name: formData.customer_name,
    p_phone: formData.phone,
    p_email: formData.email,
    p_address: formData.address,
    p_city: formData.city,
    p_postal_code: formData.postal_code,
    p_message: formData.message ?? '',
    p_items: items,
  })

  if (error) throw new Error(error.message)
  return data as CreateOrderResult
}

export async function getOrderByToken(token: string): Promise<Order | null> {
  const { data, error } = await supabase.rpc('get_order_by_token', { p_token: token })
  if (error) return null
  return (data as Order) ?? null
}

export async function updateOrderDetails(
  token: string,
  formData: OrderFormData
): Promise<void> {
  const { error } = await supabase.rpc('update_order_details', {
    p_token: token,
    p_customer_name: formData.customer_name,
    p_phone: formData.phone,
    p_email: formData.email,
    p_address: formData.address,
    p_city: formData.city,
    p_postal_code: formData.postal_code,
    p_message: formData.message ?? '',
  })

  if (error) throw new Error(error.message)
}

export async function sendOrderEmail(token: string): Promise<void> {
  const { error } = await supabase.functions.invoke('send-order-email', {
    body: { token },
  })
  if (error) throw new Error(error.message)
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
  const patch: Record<string, unknown> = { status }
  if (status === 'betald') patch.paid_at = new Date().toISOString()
  if (status === 'skickad') patch.shipped_at = new Date().toISOString()

  const { error } = await supabase.from('orders').update(patch).eq('id', id)

  if (error) throw new Error(error.message)
}

export async function markOrderShipped(
  id: string,
  trackingNumber?: string,
  carrier?: string
): Promise<void> {
  const patch: Record<string, unknown> = {
    status: 'skickad',
    shipped_at: new Date().toISOString(),
  }
  if (trackingNumber) patch.tracking_number = trackingNumber
  if (carrier) patch.carrier = carrier

  const { error } = await supabase.from('orders').update(patch).eq('id', id)

  if (error) throw new Error(error.message)
}

export async function updateOrderTracking(
  id: string,
  trackingNumber: string,
  carrier?: string
): Promise<void> {
  const patch: Record<string, unknown> = { tracking_number: trackingNumber }
  if (carrier) patch.carrier = carrier

  const { error } = await supabase.from('orders').update(patch).eq('id', id)

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
