import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Components/AuthContext'; // Ensure the correct path to AuthContext

export default function NavbarForAdmin() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('https://airlineregervationsystem-frontend.onrender.com');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/admin">IndiAirlines</Link>
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
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/admin/addAirport">Add Airport</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/viewAirport">View Airports</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/addAirplane">Add Airplane</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/viewAirplane">View Airplanes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/addFlight">Add Flights</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/AllFlights">All Flights</Link>
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
