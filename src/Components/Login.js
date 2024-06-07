import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarCommon from './NavbarCommon';
import { useAuth } from './AuthContext'; // Ensure correct import path


export default function Login() {
  const [userRole, setUserRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const { setAuth } = useAuth(); // Correctly destructure setAuth from useAuth
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { userRole, email, password };

    try {
      const response = await axios.post('http://localhost:8080/users/authenticate', loginData);
      console.log(response.data); 
      if (response.data === 'success') {
        setAuth({ email, role: userRole });
        setAlertMessage({ type: 'success', text: 'Login successful!' });
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else if (response.data === 'Invalid') {
        setAlertMessage({ type: 'danger', text: 'Please select the appropriate role' });
      } else {
        setAlertMessage({ type: 'danger', text: 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      setAlertMessage({ type: 'danger', text: 'Login failed. Please try again later.' });
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <NavbarCommon />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <form className="bg-light p-4 rounded shadow-sm" onSubmit={handleSubmit}>
          <h2 className="mb-4 text-center">Login</h2>
          {alertMessage && (
            <div className={`alert alert-${alertMessage.type}`} role="alert">
              {alertMessage.text}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="userRole" className="form-label">User Role</label>
            <select
              className="form-select"
              id="userRole"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              aria-describedby="userRoleHelp"
              required
            >
              <option value="">Select</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn w-100">Login</button>
        </form>
      </div>
    </div>
  );
}
