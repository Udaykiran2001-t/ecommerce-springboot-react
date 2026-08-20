import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();
  const justPlaced = location.state?.justPlaced;

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(err.response?.data?.message || 'Could not load orders.'));
  }, []);

  return (
    <div className="page">
      <h1>Your orders</h1>

      {justPlaced && (
        <div className="success-banner">Order placed successfully. Thanks for your purchase.</div>
      )}

      {error && <p className="error">{error}</p>}

      {orders.length === 0 && !error ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>Order #{order.id}</span>
              <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.name} x {item.quantity} — Rs. {item.priceAtPurchase * item.quantity}
                </li>
              ))}
            </ul>
            <p><strong>Total: Rs. {order.totalAmount}</strong></p>
          </div>
        ))
      )}
    </div>
  );
}