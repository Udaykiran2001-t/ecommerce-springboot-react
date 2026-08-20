export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="img-wrap">
        <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />
        <span className="price-tag">Rs. {product.price}</span>
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="stock">
          {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
        </p>
        <button disabled={product.stockQuantity === 0} onClick={() => onAddToCart(product.id)}>
          Add to cart
        </button>
      </div>
    </div>
  );
}