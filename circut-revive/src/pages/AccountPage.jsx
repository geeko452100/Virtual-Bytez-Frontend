import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { deleteSavedBuild, fetchSavedBuilds } from '../api/savedBuilds'
import { fetchUserOrders } from '../api/orders'
import { useAuth } from '../hooks/useAuth'
import { useProducts } from '../hooks/useProducts'
import { formatPrice, summarizeSelections } from '../utils/pricing'
import { cn } from '../lib/cn'
import Button from '../components/ui/Button'

export default function AccountPage() {
  const { profile } = useAuth()
  const { getProductById } = useProducts()
  const [searchParams] = useSearchParams()
  const newOrderId = searchParams.get('order')

  const [orders, setOrders] = useState([])
  const [builds, setBuilds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [ordersResult, buildsResult] = await Promise.all([
        fetchUserOrders(),
        fetchSavedBuilds(),
      ])

      if (ordersResult.error) setError(ordersResult.error.message)
      else setOrders(ordersResult.data ?? [])

      if (!buildsResult.error) setBuilds(buildsResult.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleDeleteBuild(id) {
    const { error: deleteError } = await deleteSavedBuild(id)
    if (!deleteError) {
      setBuilds((prev) => prev.filter((b) => b.id !== id))
    }
  }

  if (loading) return <p className="py-8 text-text-muted">Loading account…</p>

  return (
    <div className="text-left">
      <h1>My account</h1>
      <p className="mb-6 text-text-muted">Hello, {profile?.full_name ?? profile?.email}</p>

      {newOrderId && (
        <div className="mb-5 rounded-lg border border-phosphor/35 bg-phosphor/12 px-4 py-3.5 text-phosphor">
          Order placed successfully. Reference: <code>{newOrderId.slice(0, 8)}…</code>
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      <section className="mb-8">
        <h2>Orders</h2>
        {orders.length === 0 ? (
          <p className="py-8 text-text-muted">
            No orders yet. <Link to="/shop">Start shopping</Link>
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {orders.map((order) => (
              <li key={order.id} className="panel rounded-[10px] p-4">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  <span className={cn('status-pill', `status-pill-${order.status}`)}>{order.status}</span>
                  <strong>{formatPrice(Number(order.subtotal))}</strong>
                </div>
                <ul className="m-0 list-disc pl-4 text-sm text-text-muted">
                  {(order.order_items ?? []).map((item) => (
                    <li key={item.id}>
                      {item.product_name} × {item.quantity} — {formatPrice(Number(item.line_total))}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h2>Saved builds</h2>
        {builds.length === 0 ? (
          <p className="py-8 text-text-muted">No saved builds. Customize a product and save your configuration.</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {builds.map((build) => {
              const product = getProductById(build.product_id)
              const summary = product
                ? summarizeSelections(product, build.selections)
                : []
              return (
                <li key={build.id} className="panel rounded-[10px] p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <strong>{build.name}</strong>
                    <span>{product?.name ?? build.product_id}</span>
                  </div>
                  {summary.length > 0 && (
                    <ul className="m-0 list-disc pl-4 text-sm text-text-muted">
                      {summary.map((line) => (
                        <li key={`${line.option}-${line.value}`}>
                          {line.option}: {line.value}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/shop/${build.product_id}`}
                      state={{ selections: build.selections }}
                      className="btn btn-sm no-underline"
                    >
                      Load build
                    </Link>
                    <Button variant="ghost" size="sm" className="mt-0 w-auto" onClick={() => handleDeleteBuild(build.id)}>
                      Delete
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
