import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home({ token }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (query) => {
    const res = await api.get('/products', { params: query ? { search: query } : {} });
    setProducts(res.data);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      setMessage('Please login to add items to your cart.');
      return;
    }
    await api.post('/cart', { productId, quantity: 1 });
    setMessage('Added to cart.');
  };

  return (
    <div className="page">
      <h1>Products</h1>
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {message && <p className="info">{message}</p>}
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}
