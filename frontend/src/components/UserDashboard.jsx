import React, { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserDashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_new_password: '',
    old_password: '',
    nationality: ''
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/protected')
      .then(res => {
        setUser(res.data.user);
        setFormData({
          full_name: res.data.user.full_name,
          email: res.data.user.email,
          password: '',
          confirm_new_password: '',
          old_password: '',
          nationality: res.data.user.nationality || ''
        });
      })
      .catch(() => onLogout());
  }, [onLogout]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if ((formData.password || formData.confirm_new_password) && formData.password !== formData.confirm_new_password) {
      toast.error('New passwords do not match.');
      return;
    }

    if ((formData.password || formData.confirm_new_password) && !formData.old_password) {
      toast.error('Old password is required to change password.');
      return;
    }

    API.put('/user', formData)
      .then(res => {
        toast.success('User info updated!');
        setUser(res.data.user);
        setShowForm(false);
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'Update failed.');
      });
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!deletePassword || !deleteConfirmPassword) {
      toast.error('Please fill in both password fields.');
      return;
    }

    if (deletePassword !== deleteConfirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      await API.delete('/user', {
        data: {
          password: deletePassword,
          confirm_password: deleteConfirmPassword
        }
      });

      toast.success('Account deleted. Redirecting...');
      setTimeout(() => {
        onLogout();
        navigate('/');
      }, 5000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete account.');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Hello, {user?.full_name}!</h2>
      <button className="btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Update Information'}
      </button>
      <button className="btn logout" onClick={onLogout}>Logout</button>

      {showForm && (
        <form onSubmit={handleUpdate} className="form">
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" />
          <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" />
          <input type="password" name="old_password" value={formData.old_password} onChange={handleChange} placeholder="Old Password" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="New Password" />
          <input type="password" name="confirm_new_password" value={formData.confirm_new_password} onChange={handleChange} placeholder="Confirm New Password" />
          <button type="submit" className="btn">Save Changes</button>
        </form>
      )}

      <form onSubmit={handleDeleteAccount} className="form delete-form">
        <h3>Delete Account</h3>
        <input
          type="password"
          placeholder="Password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={deleteConfirmPassword}
          onChange={(e) => setDeleteConfirmPassword(e.target.value)}
        />
        <button type="submit" className="btn danger">Delete Account</button>
      </form>
    </div>
  );
};

export default UserDashboard;
