import React, { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const defaultForm = {
  full_name: '',
  email: '',
  password: '',
  nationality: '',
  role: 'user'
};

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    API.get('/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = user => {
    setEditingUserId(user.id);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      password: '',
      nationality: user.nationality || '',
      role: user.role
    });
  };

  const handleDelete = id => {
    const token = localStorage.getItem('token');
    API.delete(`/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        toast.success('User deleted');
        fetchUsers();
      })
      .catch(() => toast.error('Failed to delete user'));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const request = editingUserId
      ? API.put(`/admin/users/${editingUserId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      : API.post('/admin/users', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });

    request
      .then(() => {
        toast.success(editingUserId ? 'User updated' : 'User created');
        setFormData(defaultForm);
        setEditingUserId(null);
        fetchUsers();
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'Operation failed');
      });
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setFormData(defaultForm);
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <button className="btn logout" onClick={onLogout}>Logout</button>

      <form onSubmit={handleSubmit} className="form">
        <h3>{editingUserId ? 'Edit User' : 'Create New User/Admin'}</h3>
        <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required={!editingUserId} />
        <input type="text" name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleChange} />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <div>
          <button type="submit" className="btn">{editingUserId ? 'Update' : 'Create'}</button>
          {editingUserId && <button type="button" className="btn" onClick={handleCancel}>Cancel</button>}
        </div>
      </form>

      <hr />
      <h3>All Users</h3>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Nationality</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.nationality || 'N/A'}</td>
                <td>{user.role}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn edit" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="btn delete" onClick={() => handleDelete(user.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
