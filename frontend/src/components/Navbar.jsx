import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ token, role, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Ecommerce Store</Link>
      <div className="nav-links">
        <Link to="/">Products</Link>
        {token && <Link to="/cart">Cart</Link>}
        {token && <Link to="/orders">Orders</Link>}
        {role === 'ADMIN' && <Link to="/admin">Admin</Link>}
        {!token && <Link to="/login">Login</Link>}
        {!token && <Link to="/register">Register</Link>}
        {token && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
}
