import { useState } from 'react'
import { CATEGORIES } from '../../data/products'
import Button from '../ui/Button'

export default function AdminProductForm({ initial, onSave, onCancel }) {
  const [product, setProduct] = useState(initial)
  const [optionsJson, setOptionsJson] = useState(
    JSON.stringify(initial.customizationOptions ?? [], null, 2),
  )
  const [jsonError, setJsonError] = useState('')

  function updateField(field, value) {
    setProduct((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    let customizationOptions
    try {
      customizationOptions = JSON.parse(optionsJson)
      setJsonError('')
    } catch {
      setJsonError('Customization options must be valid JSON.')
      return
    }

    onSave({
      ...product,
      basePrice: Number(product.basePrice),
      conditionGrade: product.conditionGrade ? Number(product.conditionGrade) : null,
      stockCount: Number(product.stockCount),
      customizationOptions,
    })
  }

  return (
    <form className="panel mb-6 p-5" onSubmit={handleSubmit}>
      <h2>{product.id ? 'Edit product' : 'New product'}</h2>

      <div className="form-row">
        <label className="form-label">
          ID (slug)
          <input
            className="form-input"
            required
            value={product.id}
            onChange={(e) => updateField('id', e.target.value)}
            disabled={Boolean(initial.id)}
          />
        </label>
        <label className="form-label">
          Name
          <input className="form-input" required value={product.name} onChange={(e) => updateField('name', e.target.value)} />
        </label>
      </div>

      <div className="form-row">
        <label className="form-label">
          Era
          <input className="form-input" value={product.era ?? ''} onChange={(e) => updateField('era', e.target.value)} />
        </label>
        <label className="form-label">
          Category
          <select className="form-input" value={product.category} onChange={(e) => updateField('category', e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="form-label">
          Base price
          <input
            className="form-input"
            type="number"
            min="0"
            required
            value={product.basePrice}
            onChange={(e) => updateField('basePrice', e.target.value)}
          />
        </label>
      </div>

      <label className="form-label">
        Description
        <textarea
          className="form-input"
          rows={3}
          value={product.description ?? ''}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </label>

      <div className="form-row">
        <label className="form-label">
          Condition label
          <input className="form-input" value={product.condition ?? ''} onChange={(e) => updateField('condition', e.target.value)} />
        </label>
        <label className="form-label">
          Condition grade (1–10)
          <input
            className="form-input"
            type="number"
            min="1"
            max="10"
            value={product.conditionGrade ?? ''}
            onChange={(e) => updateField('conditionGrade', e.target.value)}
          />
        </label>
        <label className="form-label">
          Stock count
          <input
            className="form-input"
            type="number"
            min="0"
            value={product.stockCount ?? 0}
            onChange={(e) => updateField('stockCount', e.target.value)}
          />
        </label>
      </div>

      <label className="form-label">
        Image URL
        <input className="form-input" value={product.imageUrl ?? ''} onChange={(e) => updateField('imageUrl', e.target.value)} />
      </label>

      <label className="form-label !mb-3.5 !flex-row !items-center !gap-2">
        <input
          type="checkbox"
          checked={product.active !== false}
          onChange={(e) => updateField('active', e.target.checked)}
        />
        Active (visible in shop)
      </label>

      <label className="form-label">
        Customization options (JSON)
        <textarea
          rows={12}
          className="form-input font-mono text-sm"
          value={optionsJson}
          onChange={(e) => setOptionsJson(e.target.value)}
        />
      </label>
      {jsonError && <p className="text-sm text-danger">{jsonError}</p>}

      <div className="flex gap-2">
        <Button type="submit" variant="primary">Save product</Button>
        <Button type="button" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
