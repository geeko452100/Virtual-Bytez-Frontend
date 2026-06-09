import { useCallback, useMemo, useReducer } from 'react'
import { useProducts } from '../hooks/useProducts'
import { calculateCustomizationPrice } from '../utils/pricing'
import { CartContext } from './cartContext'

function createLineId(productId, selections) {
  return `${productId}:${JSON.stringify(selections)}`
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, selections, quantity = 1 } = action.payload
      const lineId = createLineId(productId, selections)
      const existing = state.items.find((item) => item.lineId === lineId)

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.lineId === lineId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        }
      }

      return {
        ...state,
        items: [
          ...state.items,
          { lineId, productId, selections, quantity },
        ],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.lineId !== action.payload.lineId),
      }

    case 'UPDATE_QUANTITY': {
      const { lineId, quantity } = action.payload
      if (quantity < 1) {
        return {
          ...state,
          items: state.items.filter((item) => item.lineId !== lineId),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.lineId === lineId ? { ...item, quantity } : item,
        ),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'TOGGLE_CART':
      return { ...state, isOpen: action.payload ?? !state.isOpen }

    default:
      return state
  }
}

const initialState = { items: [], isOpen: false }

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { getProductById } = useProducts()

  const addItem = useCallback((productId, selections, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { productId, selections, quantity } })
  }, [])

  const removeItem = useCallback((lineId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { lineId } })
  }, [])

  const updateQuantity = useCallback((lineId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { lineId, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const toggleCart = useCallback((isOpen) => {
    dispatch({ type: 'TOGGLE_CART', payload: isOpen })
  }, [])

  const enrichedItems = useMemo(
    () =>
      state.items
        .map((item) => {
          const product = getProductById(item.productId)
          if (!product) return null
          const pricing = calculateCustomizationPrice(product, item.selections)
          return {
            ...item,
            product,
            unitPrice: pricing.total,
            lineTotal: pricing.total * item.quantity,
          }
        })
        .filter(Boolean),
    [state.items, getProductById],
  )

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items],
  )

  const subtotal = useMemo(
    () => enrichedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [enrichedItems],
  )

  const value = useMemo(
    () => ({
      items: enrichedItems,
      itemCount,
      subtotal,
      isOpen: state.isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart,
    }),
    [
      enrichedItems,
      itemCount,
      subtotal,
      state.isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
