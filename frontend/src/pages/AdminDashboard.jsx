import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '' });

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  const loadOrders = async () => {
    const res = await api.get('/admin/orders');
    setOrders(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/products', {
      ...form,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity, 10),
    });
    setForm({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '' });
    loadProducts();
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const updateOrderStatus = async (id, status) => {
    await api.patch(`/admin/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="page">
      <h1>Admin dashboard</h1>

      <section>
        <h2>Add product</h2>
        <form onSubmit={handleCreate} className="admin-form">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input placeholder="Stock quantity" type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} required />
          <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <button type="submit">Add product</button>
        </form>
      </section>

      <section>
        <h2>Products</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Price</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>Rs. {p.price}</td>
                <td>{p.stockQuantity}</td>
                <td><button onClick={() => handleDelete(p.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>All orders</h2>
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>Order #{order.id} — {order.user?.email}</span>
              <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                <option value="PLACED">PLACED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <p>Total: Rs. {order.totalAmount}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
