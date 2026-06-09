import { useCallback, useMemo, useState } from 'react'
import { calculateCustomizationPrice, getDefaultSelections } from '../utils/pricing'

export function useProductCustomization(product, initialSelections = null) {
  const [selections, setSelections] = useState(() =>
    initialSelections ?? getDefaultSelections(product),
  )

  const setSelectValue = useCallback((optionId, value) => {
    setSelections((prev) => ({ ...prev, [optionId]: value }))
  }, [])

  const toggleCheckboxValue = useCallback((optionId, value) => {
    setSelections((prev) => {
      const current = prev[optionId] ?? []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [optionId]: next }
    })
  }, [])

  const setTextValue = useCallback((optionId, value) => {
    setSelections((prev) => ({ ...prev, [optionId]: value }))
  }, [])

  const resetSelections = useCallback(() => {
    setSelections(getDefaultSelections(product))
  }, [product])

  const pricing = useMemo(
    () => calculateCustomizationPrice(product, selections),
    [product, selections],
  )

  return {
    selections,
    pricing,
    setSelectValue,
    toggleCheckboxValue,
    setTextValue,
    resetSelections,
  }
}
