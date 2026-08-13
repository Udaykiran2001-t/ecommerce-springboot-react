export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={product.imageUrl || 'https://via.placeholder.com/200'} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">Rs. {product.price}</p>
      <p className="stock">
        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
      </p>
      <button disabled={product.stockQuantity === 0} onClick={() => onAddToCart(product.id)}>
        Add to cart
      </button>
    </div>
  );
}
