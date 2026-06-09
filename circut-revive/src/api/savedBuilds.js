import { getSupabase } from '../lib/supabase'

export async function fetchSavedBuilds() {
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
    .from('saved_builds')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function saveBuild({ productId, name, selections }) {
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
    .from('saved_builds')
    .insert({
      user_id: user.id,
      product_id: productId,
      name,
      selections,
    })
    .select()
    .single()

  return { data, error }
}

export async function deleteSavedBuild(id) {
  const supabase = getSupabase()
  if (!supabase) return { error: new Error('Supabase not configured') }

  const { error } = await supabase.from('saved_builds').delete().eq('id', id)
  return { error }
}
