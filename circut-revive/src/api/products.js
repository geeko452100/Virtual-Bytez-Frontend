import { getSupabase } from '../lib/supabase'
import { mapProduct, mapProductToRow } from '../lib/productMapper'

export async function fetchProducts({ includeInactive = false } = {}) {
  const supabase = getSupabase()
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }

  let query = supabase.from('products').select('*').order('name')
  if (!includeInactive) {
    query = query.eq('active', true)
  }

  const { data, error } = await query
  if (error) return { data: null, error }
  return { data: data.map(mapProduct), error: null }
}

export async function fetchProductById(id) {
  const supabase = getSupabase()
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }

  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle()
  if (error) return { data: null, error }
  return { data: mapProduct(data), error: null }
}

export async function upsertProduct(product) {
  const supabase = getSupabase()
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }

  const { data, error } = await supabase
    .from('products')
    .upsert(mapProductToRow(product))
    .select()
    .single()

  if (error) return { data: null, error }
  return { data: mapProduct(data), error: null }
}

export async function deleteProduct(id) {
  const supabase = getSupabase()
  if (!supabase) return { error: new Error('Supabase not configured') }

  const { error } = await supabase.from('products').delete().eq('id', id)
  return { error }
}

export async function updateOrderStatus(orderId, status) {
  const supabase = getSupabase()
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()

  return { data, error }
}

export async function fetchAllOrders() {
  const supabase = getSupabase()
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  return { data, error }
}
