import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { saveBuild } from '../../api/savedBuilds'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useProductCustomization } from '../../hooks/useProductCustomization'
import { formatPrice } from '../../utils/pricing'
import ProductCustomizer from './ProductCustomizer'
import ConditionBadge from './ConditionBadge'
import { ProductImageWithFallback } from './ProductImage'
import Button from '../ui/Button'

export default function ProductDetailContent({ product }) {
  const location = useLocation()
  const initialSelections = location.state?.selections ?? null
  const buildKey = `${product.id}:${JSON.stringify(initialSelections ?? {})}`

  return (
    <ProductDetailInner
      key={buildKey}
      product={product}
      initialSelections={initialSelections}
    />
  )
}

function ProductDetailInner({ product, initialSelections }) {
  const { addItem, toggleCart } = useCart()
  const { isAuthenticated, isConfigured } = useAuth()
  const {
    selections,
    pricing,
    setSelectValue,
    toggleCheckboxValue,
    setTextValue,
    resetSelections,
  } = useProductCustomization(product, initialSelections)

  const [saveName, setSaveName] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const inStock = (product.stockCount ?? 0) > 0

  function handleAddToCart() {
    addItem(product.id, selections, 1)
    toggleCart(true)
  }

  async function handleSaveBuild(e) {
    e.preventDefault()
    if (!isAuthenticated) return

    setSaving(true)
    setSaveMessage('')
    const name = saveName.trim() || `${product.name} build`
    const { error } = await saveBuild({
      productId: product.id,
      name,
      selections,
    })
    setSaving(false)

    if (error) {
      setSaveMessage(error.message)
    } else {
      setSaveMessage('Build saved to your account.')
      setSaveName('')
    }
  }

  return (
    <div className="text-left">
      <Link to="/shop" className="mb-6 inline-block border-none bg-transparent p-0 text-text-muted no-underline hover:text-accent">
        ← Back to shop
      </Link>

      <div className="mb-8 grid grid-cols-[180px_1fr] gap-6 max-md:grid-cols-1">
        <div className="grid aspect-square place-items-center overflow-hidden rounded-xl border border-border bg-surface p-3">
          <ProductImageWithFallback
            product={product}
            className="min-h-[180px] [&_img]:max-h-[220px] [&_img]:rounded-xl [&_img]:object-cover"
          />
        </div>
        <div>
          <p className="mb-2 font-mono text-sm text-phosphor">{product.era}</p>
          <ConditionBadge grade={product.conditionGrade} condition={product.condition} />
          <h1>{product.name}</h1>
          <p className="my-3 max-w-[560px] text-text-muted">{product.description}</p>
          <p className="font-mono text-accent">Starting at {formatPrice(product.basePrice)}</p>
          <p className="mt-2 font-mono text-sm text-phosphor">
            {inStock ? `${product.stockCount} in stock` : 'Currently out of stock'}
          </p>
        </div>
      </div>

      <ProductCustomizer
        product={product}
        selections={selections}
        pricing={pricing}
        onSelectChange={setSelectValue}
        onCheckboxToggle={toggleCheckboxValue}
        onTextChange={setTextValue}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" size="lg" onClick={handleAddToCart} disabled={!inStock}>
          {inStock ? `Add to cart — ${formatPrice(pricing.total)}` : 'Out of stock'}
        </Button>
        <Button onClick={resetSelections}>Reset options</Button>
      </div>

      {isConfigured && (
        <section className="panel mt-8 rounded-[10px] p-5 text-left">
          <h2>Save this build</h2>
          {!isAuthenticated ? (
            <p>
              <Link to="/login" state={{ from: `/shop/${product.id}` }}>Sign in</Link> to save configurations for later.
            </p>
          ) : (
            <form className="mt-3 flex flex-wrap gap-3" onSubmit={handleSaveBuild}>
              <input
                type="text"
                className="form-input min-w-[200px] flex-1"
                placeholder="Build name (optional)"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                maxLength={48}
              />
              <Button variant="primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save build'}
              </Button>
              {saveMessage && <p className="w-full text-sm text-phosphor">{saveMessage}</p>}
            </form>
          )}
        </section>
      )}
    </div>
  )
}
