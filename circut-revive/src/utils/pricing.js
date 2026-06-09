/**
 * Resolves selected customization values into a line-item price breakdown.
 */

export function getDefaultSelections(product) {
  const selections = {}

  for (const option of product.customizationOptions) {
    if (option.type === 'select') {
      selections[option.id] = option.defaultValue
    } else if (option.type === 'checkbox') {
      selections[option.id] = []
    } else if (option.type === 'text') {
      selections[option.id] = ''
    }
  }

  return selections
}

export function calculateCustomizationPrice(product, selections) {
  let addOnTotal = 0
  const breakdown = []

  for (const option of product.customizationOptions) {
    const value = selections[option.id]

    if (option.type === 'select') {
      const choice = option.choices.find((c) => c.value === value)
      if (choice?.priceModifier) {
        addOnTotal += choice.priceModifier
        breakdown.push({ label: `${option.label}: ${choice.label}`, amount: choice.priceModifier })
      }
    }

    if (option.type === 'checkbox' && Array.isArray(value)) {
      for (const selected of value) {
        const choice = option.choices.find((c) => c.value === selected)
        if (choice?.priceModifier) {
          addOnTotal += choice.priceModifier
          breakdown.push({ label: choice.label, amount: choice.priceModifier })
        }
      }
    }

    if (option.type === 'text' && value?.trim() && option.priceModifier) {
      addOnTotal += option.priceModifier
      breakdown.push({ label: `${option.label} (“${value.trim()}”)`, amount: option.priceModifier })
    }
  }

  return {
    basePrice: product.basePrice,
    addOnTotal,
    total: product.basePrice + addOnTotal,
    breakdown,
  }
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function summarizeSelections(product, selections) {
  const summary = []

  for (const option of product.customizationOptions) {
    const value = selections[option.id]

    if (option.type === 'select') {
      const choice = option.choices.find((c) => c.value === value)
      if (choice) summary.push({ option: option.label, value: choice.label })
    }

    if (option.type === 'checkbox' && Array.isArray(value) && value.length > 0) {
      const labels = value
        .map((v) => option.choices.find((c) => c.value === v)?.label)
        .filter(Boolean)
      if (labels.length) summary.push({ option: option.label, value: labels.join(', ') })
    }

    if (option.type === 'text' && value?.trim()) {
      summary.push({ option: option.label, value: value.trim() })
    }
  }

  return summary
}
