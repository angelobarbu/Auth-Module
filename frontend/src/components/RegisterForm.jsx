import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import GoogleLoginButton from './GoogleLoginButton';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    nationality: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (token) => {
    localStorage.setItem('token', token);
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    try {
      await API.post('/register', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>REGISTER</h2>
      <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <input type="password" name="confirm_password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} required />
      <input type="text" name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleChange} />
      <button type="submit">REGISTER</button>
      {error && <p className="error">{error}</p>}
      <GoogleLoginButton onLogin={handleLogin} />
      <p className="link-text">Already have an account? <Link to="/">Log in</Link></p>
    </form>
  );
};

export default RegisterForm;