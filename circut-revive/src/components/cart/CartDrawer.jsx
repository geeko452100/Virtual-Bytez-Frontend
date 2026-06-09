import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { formatPrice, summarizeSelections } from '../../utils/pricing'
import Button from '../ui/Button'

export default function CartDrawer() {
  const {
    items,
    subtotal,
    isOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart()
  const { isConfigured } = useAuth()

  if (!isOpen) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 border-none bg-black/55"
        aria-label="Close cart"
        onClick={() => toggleCart(false)}
      />
      <aside
        className="fixed top-0 right-0 z-50 flex h-svh w-full max-w-[420px] flex-col border-l border-border bg-surface shadow-[var(--shadow-card)]"
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between border-b border-border p-5">
          <h2 className="m-0">Your cart</h2>
          <button
            type="button"
            className="border-none bg-transparent text-text-muted"
            onClick={() => toggleCart(false)}
          >
            Close
          </button>
        </header>

        {items.length === 0 ? (
          <p className="p-5 px-5 text-text-muted">No items yet. Customize something retro.</p>
        ) : (
          <ul className="m-0 flex-1 list-none overflow-y-auto p-0">
            {items.map((item) => {
              const summary = summarizeSelections(item.product, item.selections)
              return (
                <li key={item.lineId} className="border-b border-border px-5 py-4">
                  <div className="flex justify-between gap-3">
                    <strong>{item.product.name}</strong>
                    <button
                      type="button"
                      className="border-none bg-transparent text-sm text-text-muted"
                      onClick={() => removeItem(item.lineId)}
                    >
                      Remove
                    </button>
                  </div>

                  {summary.length > 0 && (
                    <ul className="mt-2 mb-0 list-disc pl-4 text-sm text-text-muted">
                      {summary.map((line) => (
                        <li key={`${line.option}-${line.value}`}>
                          {line.option}: {line.value}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden rounded-md border border-border">
                      <button
                        type="button"
                        className="h-8 w-8 border-none bg-surface-raised text-text-h"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className="h-8 w-8 border-none bg-surface-raised text-text-h"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="font-mono text-accent">{formatPrice(item.lineTotal)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <footer className="border-t border-border p-5">
          <div className="mb-4 flex justify-between font-mono font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {items.length > 0 && (
            isConfigured ? (
              <Link
                to="/checkout"
                className="btn btn-primary btn-lg block text-center no-underline"
                onClick={() => toggleCart(false)}
              >
                Checkout
              </Link>
            ) : (
              <Button variant="primary" size="lg" className="w-full" disabled>
                Configure Supabase to checkout
              </Button>
            )
          )}
          {items.length > 0 && (
            <Button variant="ghost" onClick={clearCart}>
              Clear cart
            </Button>
          )}
        </footer>
      </aside>
    </>
  )
}
