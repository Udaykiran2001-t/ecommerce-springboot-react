import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cart').then((res) => {
      if (res.data.length === 0) navigate('/cart');
      setCart(res.data);
    });
  }, []);

  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const validate = () => {
    const cardDigits = form.cardNumber.replace(/\s/g, '');
    if (form.cardName.trim().length < 2) return 'Enter the name on the card.';
    if (cardDigits.length !== 16) return 'Card number must be 16 digits.';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return 'Expiry must be in MM/YY format.';
    const [mm, yy] = form.expiry.split('/').map(Number);
    if (mm < 1 || mm > 12) return 'Enter a valid expiry month.';
    const now = new Date();
    const expDate = new Date(2000 + yy, mm);
    if (expDate < now) return 'Card has expired.';
    if (!/^\d{3,4}$/.test(form.cvv)) return 'CVV must be 3 or 4 digits.';
    return '';
  };

  const handlePay = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setProcessing(true);

    // Simulated payment gateway delay
    setTimeout(async () => {
      try {
        await api.post('/orders');
        navigate('/orders', { state: { justPlaced: true } });
      } catch (err) {
        setError(err.response?.data?.message || 'Payment succeeded but order placement failed. Contact support.');
        setProcessing(false);
      }
    }, 1500);
  };

  return (
    <div className="page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form onSubmit={handlePay} className="payment-form">
          <h2>Payment details</h2>

          <label>Name on card</label>
          <input
            type="text"
            placeholder="Uday Kiran Talari"
            value={form.cardName}
            onChange={(e) => setForm({ ...form, cardName: e.target.value })}
          />

          <label>Card number</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={form.cardNumber}
            onChange={(e) => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })}
          />

          <div className="form-row">
            <div>
              <label>Expiry (MM/YY)</label>
              <input
                type="text"
                placeholder="08/29"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
              />
            </div>
            <div>
              <label>CVV</label>
              <input
                type="password"
                placeholder="123"
                maxLength={4}
                value={form.cvv}
                onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={processing}>
            {processing ? 'Processing payment...' : `Pay Rs. ${total}`}
          </button>

          <p className="info" style={{ marginTop: '12px', fontSize: '13px' }}>
            This is a demo checkout — no real payment is processed and no real card
            details are transmitted or stored.
          </p>
        </form>

        <div className="order-summary">
          <h2>Order summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="summary-row">
              <span>{item.product.name} x {item.quantity}</span>
              <span>Rs. {item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
