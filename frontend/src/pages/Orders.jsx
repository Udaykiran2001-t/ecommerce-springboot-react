import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="page">
      <h1>Your orders</h1>
      {orders.length === 0 ? (
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
            <p>Total: Rs. {order.totalAmount}</p>
          </div>
        ))
      )}
    </div>
  );
}
