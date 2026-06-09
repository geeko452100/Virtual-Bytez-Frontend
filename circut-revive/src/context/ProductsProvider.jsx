import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../api/products'
import { seedProducts } from '../data/products'
import { isSupabaseConfigured } from '../lib/config'
import { ProductsContext } from './productsContext'

async function loadCatalog(includeInactive = false) {
  if (!isSupabaseConfigured) {
    return { products: seedProducts, source: 'local', error: null }
  }

  const { data, error: fetchError } = await fetchProducts({ includeInactive })

  if (fetchError || !data?.length) {
    console.warn('Using local catalog fallback', fetchError)
    return {
      products: seedProducts,
      source: 'local',
      error: fetchError?.message ?? null,
    }
  }

  return { products: data, source: 'supabase', error: null }
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(seedProducts)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)
  const [source, setSource] = useState(isSupabaseConfigured ? 'loading' : 'local')

  useEffect(() => {
    let active = true

    loadCatalog().then((result) => {
      if (!active) return
      setProducts(result.products)
      setSource(result.source)
      setError(result.error)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  const reload = useCallback(async (includeInactive = false) => {
    setLoading(true)
    const result = await loadCatalog(includeInactive)
    setProducts(result.products)
    setSource(result.source)
    setError(result.error)
    setLoading(false)
  }, [])

  const getProductById = useCallback(
    (id) => products.find((p) => p.id === id) ?? null,
    [products],
  )

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      source,
      getProductById,
      reload: () => reload(false),
      reloadAll: () => reload(true),
    }),
    [products, loading, error, source, getProductById, reload],
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}
