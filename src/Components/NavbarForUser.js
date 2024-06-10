import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Components/AuthContext'; // Ensure the correct path to AuthContext

export default function NavbarForUser() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (auth && auth.email) {
      axios.get(`https://airlineregervationsystem-backend.onrender.com/users/name/${auth.email}`)
        .then(response => {
          setFirstName(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the user name!', error);
        });
    }
  }, [auth]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/user">IndiAirlines</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                  aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/about">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/scheduled-flights">Scheduled Flights</Link>
              </li>
            </ul>
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <span className="navbar-text text-primary font-weight-bold" style={{ fontSize: '18px' }}>
                  Hello, {firstName}
                </span>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/user/myWallet">My Wallet</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/user/bookedTicket">Booked Tickets</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" onClick={handleLogout}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
