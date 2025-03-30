import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SetPasswordForm from './components/SetPasswordForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import API from './api';

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogin = async (token) => {
    localStorage.setItem('token', token);
    try {
      const res = await API.get('/protected', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data.user);

      if (res.data.user.password_hash === '') {
        toast.info("Please set a password to enable manual login.");
        navigate('/set-password');
      } else if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch {
      localStorage.removeItem('token');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/protected', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser(res.data.user);
      }).catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route
        path="/"
        element={
            !user ? (
            <LoginForm onLogin={handleLogin} />
            ) : user.password_hash === '' ? (
            <Navigate to="/set-password" />
            ) : user.role === 'admin' ? (
            <Navigate to="/admin" />
            ) : (
            <Navigate to="/dashboard" />
            )
        }
       />
      <Route
        path="/register"
        element={!user ? <RegisterForm /> : <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} />}
      />
      <Route
        path="/dashboard"
        element={user && user.role === 'user' ? <UserDashboard onLogout={handleLogout} /> : <Navigate to="/" />}
      />
      <Route
        path="/admin"
        element={user && user.role === 'admin' ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />}
      />
      <Route
        path="/set-password"
        element={user && user.password_hash === '' ? <SetPasswordForm /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default AppRoutes;