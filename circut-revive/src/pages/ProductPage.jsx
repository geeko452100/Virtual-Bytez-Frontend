import { Link, useParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductDetailContent from '../components/product/ProductDetailContent'

export default function ProductPage() {
  const { productId } = useParams()
  const { getProductById, loading } = useProducts()
  const product = getProductById(productId)

  if (loading) return <p className="py-8 text-text-muted">Loading product…</p>
  if (!product) {
    return (
      <div className="py-8 text-text-muted">
        <p>Product not found.</p>
        <Link to="/shop">Back to shop</Link>
      </div>
    )
  }

  return <ProductDetailContent product={product} />
}
