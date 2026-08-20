import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('OTP sent. Check your email (or the backend console if email isn\'t configured yet).');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send OTP.');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      setMessage('Password reset successfully. You can log in now.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password.');
    }
  };

  return (
    <div className="auth-form">
      <h2>Reset your password</h2>

      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <input
            type="email"
            placeholder="Your account email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleReset}>
          {message && <p className="info">{message}</p>}
          <input
            type="text"
            placeholder="6-digit OTP"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
          />
          <input
            type="password"
            placeholder="New password (min 6 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Reset password</button>
        </form>
      )}

      <p><Link to="/login">Back to login</Link></p>
    </div>
  );
}