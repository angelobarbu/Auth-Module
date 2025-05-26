import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import GoogleLoginButton from './GoogleLoginButton';
import DecentralisedIdentityLoginButton from './DecentralisedIdentityLoginButton';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/login', formData);
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>LOGIN</h2>
      <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <button type="submit">LOGIN</button>
      {error && <p className="error">{error}</p>}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <GoogleLoginButton onLogin={onLogin} />
        <DecentralisedIdentityLoginButton onLogin={onLogin} />
      </div>
      <p className="link-text">Don't have an account? <Link to="/register">Sign up</Link></p>
    </form>
  );
};

export default LoginForm;