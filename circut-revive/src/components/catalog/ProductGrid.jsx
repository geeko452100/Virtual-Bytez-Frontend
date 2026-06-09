import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return <p className="py-8 text-text-muted">No products match this category.</p>
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
