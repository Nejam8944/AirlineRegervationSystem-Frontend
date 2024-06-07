import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateFlight.css';
import NavbarForAdmin from '../Components/NavbarForAdmin';

const UpdateFlight = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight } = location.state || {};

  const [flightData, setFlightData] = useState({
    flightNumber: flight?.flightNumber || '',
    airplane: flight?.airplane || '',
    departureAirport: flight?.departureAirport || '',
    arrivalAirport: flight?.arrivalAirport || '',
    flightStatus: flight?.flightStatus || '',
    departureTime: flight ? new Date(flight.departureTime).toISOString().slice(0, 16) : '',
    arrivalTime: flight ? new Date(flight.arrivalTime).toISOString().slice(0, 16) : '',
    economySeatFare: flight?.economySeatFare || 0,
    businessSeatFare: flight?.businessSeatFare || 0,
    firstClassSeatFare: flight?.firstClassSeatFare || 0,
  });

  const [airplanes, setAirplanes] = useState([]);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/airplane/all')
      .then(response => {
        setAirplanes(response.data.map(plane => plane.airplaneName));
      })
      .catch(error => {
        console.error('There was an error fetching the airplane data!', error);
      });

    axios.get('http://localhost:8080/airport/all')
      .then(response => {
        setAirports(response.data.map(airport => airport.airportLocation));
      })
      .catch(error => {
        console.error('There was an error fetching the airport data!', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('http://localhost:8080/flight/update', flightData)
      .then((response) => {
        console.log(response.data);
        alert('Flight updated successfully');
        navigate('/admin/allFlights');
      })
      .catch((error) => {
        console.error('There was an error updating the flight!', error);
      });
  };

  return (
    <div><NavbarForAdmin/>
    <div className="update-flight">
      <h2>Update Flight</h2>
      <form onSubmit={handleSubmit} className="update-flight-form">
        <div className="form-group">
          <label>Flight Number</label>
          <input
            type="text"
            name="flightNumber"
            value={flightData.flightNumber}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Airplane</label>
          <select name="airplane" value={flightData.airplane} onChange={handleChange}>
            <option value="">Select Airplane</option>
            {airplanes.map((plane, index) => (
              <option key={index} value={plane}>{plane}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Departure Airport</label>
          <select name="departureAirport" value={flightData.departureAirport} onChange={handleChange}>
            <option value="">Select Departure Airport</option>
            {airports.map((airport, index) => (
              <option key={index} value={airport}>{airport}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Arrival Airport</label>
          <select name="arrivalAirport" value={flightData.arrivalAirport} onChange={handleChange}>
            <option value="">Select Arrival Airport</option>
            {airports.map((airport, index) => (
              <option key={index} value={airport}>{airport}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Flight Status</label>
          <select name="flightStatus" value={flightData.flightStatus} onChange={handleChange}>
            <option value="">Select Flight Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="delayed">Delayed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        <div className="form-group">
          <label>Departure Time</label>
          <input
            type="datetime-local"
            name="departureTime"
            value={flightData.departureTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Arrival Time</label>
          <input
            type="datetime-local"
            name="arrivalTime"
            value={flightData.arrivalTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Economy Seat Fare</label>
          <input
            type="number"
            name="economySeatFare"
            value={flightData.economySeatFare}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Business Seat Fare</label>
          <input
            type="number"
            name="businessSeatFare"
            value={flightData.businessSeatFare}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>First Class Seat Fare</label>
          <input
            type="number"
            name="firstClassSeatFare"
            value={flightData.firstClassSeatFare}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button className='btn' type="submit">Update</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default UpdateFlight;
