import { getSupabase } from '../lib/supabase'

export async function createOrder({ items, subtotal, shippingAddress }) {
  const supabase = getSupabase()
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { data: null, error: userError ?? new Error('Not authenticated') }
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      subtotal,
      shipping_address: shippingAddress,
      status: 'pending',
    })
    .select()
    .single()

  if (orderError) return { data: null, error: orderError }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    selections: item.selections,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    line_total: item.lineTotal,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id)
    return { data: null, error: itemsError }
  }

  return { data: order, error: null }
}

export async function fetchUserOrders() {
  const supabase = getSupabase()
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { data: null, error: userError ?? new Error('Not authenticated') }
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return { data, error }
}
