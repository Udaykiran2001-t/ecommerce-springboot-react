import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await api.get('/cart');
    setItems(res.data);
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    await api.put(`/cart/${itemId}`, null, { params: { quantity } });
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/${itemId}`);
    fetchCart();
  };

  const placeOrder = async () => {
    try {
      await api.post('/orders');
      setMessage('Order placed successfully.');
      setItems([]);
      setTimeout(() => navigate('/orders'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not place order.');
    }
  };

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="page">
      <h1>Your cart</h1>
      {message && <p className="info">{message}</p>}
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="cart-row">
              <span>{item.product.name}</span>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
              />
              <span>Rs. {item.product.price * item.quantity}</span>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}
          <h3>Total: Rs. {total}</h3>
          <button onClick={placeOrder}>Place order</button>
        </>
      )}
    </div>
  );
}
