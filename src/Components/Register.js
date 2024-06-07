import React, { useState } from 'react';
import axios from 'axios';
import NavbarCommon from './NavbarCommon';
import './Register.css'; // Add CSS file to style the form

export default function Register() {
  const [userRole, setUserRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlertMessage({ type: 'danger', text: 'Passwords do not match!' });
      return;
    }

    const userData = {
      userRole,
      name,
      email,
      password,
      contactNumber,
    };

    try {
      const response = await axios.post('http://localhost:8080/users/register', userData);
      setAlertMessage({ type: 'success', text: 'Registration successful!' });
    } catch (error) {
      setAlertMessage({ type: 'danger', text: 'Registration failed!' });
      console.error('There was an error!', error);
    }
  };

  return (
    <div>
      <NavbarCommon />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <form className="bg-light p-4 rounded shadow-sm w-50" onSubmit={handleSubmit}>
          <h2 className="mb-4 text-center">Register</h2>
          {alertMessage && (
            <div className={`alert alert-${alertMessage.type}`} role="alert">
              {alertMessage.text}
            </div>
          )}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="userRole" className="form-label">User Role</label>
              <select
                className="form-select"
                id="userRole"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
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
            <div className="col-md-6 mb-3">
              <label htmlFor="contactNumber" className="form-label">Contact Number</label>
              <input
                type="text"
                className="form-control"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
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
            <div className="col-md-6 mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn w-100">Register</button>
        </form>
      </div>
    </div>
  );
}
