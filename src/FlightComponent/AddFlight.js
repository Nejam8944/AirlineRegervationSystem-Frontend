import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddFlight.css'; // Make sure to create this CSS file
import NavbarForAdmin from '../Components/NavbarForAdmin';

const AddFlight = () => {
  const [flight, setFlight] = useState({
    flightNumber: '',
    airplane: '',
    departureAirport: '',
    arrivalAirport: '',
    flightStatus: '',
    departureTime: '',
    arrivalTime: '',
    economySeatFare: 0,
    businessSeatFare: 0,
    firstClassSeatFare: 0,
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
    setFlight((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/flight/add', flight)
      .then((response) => {
        console.log(response.data);
        alert('Flight added successfully');
        setFlight({
          flightNumber: '',
          airplane: '',
          departureAirport: '',
          arrivalAirport: '',
          flightStatus: '',
          departureTime: '',
          arrivalTime: '',
          economySeatFare: 0,
          businessSeatFare: 0,
          firstClassSeatFare: 0,
        });
      })
      .catch((error) => {
        console.error('There was an error adding the flight!', error);
      });
  };

  return (
    <div><NavbarForAdmin/>
    <div className="add-flight">
      <h2>Add Flight</h2>
      <form onSubmit={handleSubmit} className="add-flight-form">
        <div className="form-group">
          <label>Flight Number</label>
          <input
            type="text"
            name="flightNumber"
            value={flight.flightNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Airplane</label>
          <select name="airplane" value={flight.airplane} onChange={handleChange}>
            <option value="">Select Airplane</option>
            {airplanes.map((plane, index) => (
              <option key={index} value={plane}>{plane}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Departure Airport</label>
          <select name="departureAirport" value={flight.departureAirport} onChange={handleChange}>
            <option value="">Select Departure Airport</option>
            {airports.map((airport, index) => (
              <option key={index} value={airport}>{airport}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Arrival Airport</label>
          <select name="arrivalAirport" value={flight.arrivalAirport} onChange={handleChange}>
            <option value="">Select Arrival Airport</option>
            {airports.map((airport, index) => (
              <option key={index} value={airport}>{airport}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Flight Status</label>
          <select name="flightStatus" value={flight.flightStatus} onChange={handleChange}>
            <option value="">Select Flight Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Delayed">Delayed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
        <div className="form-group">
          <label>Departure Time</label>
          <input
            type="datetime-local"
            name="departureTime"
            value={flight.departureTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Arrival Time</label>
          <input
            type="datetime-local"
            name="arrivalTime"
            value={flight.arrivalTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Economy Seat Fare</label>
          <input
            type="number"
            name="economySeatFare"
            value={flight.economySeatFare}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Business Seat Fare</label>
          <input
            type="number"
            name="businessSeatFare"
            value={flight.businessSeatFare}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>First Class Seat Fare</label>
          <input
            type="number"
            name="firstClassSeatFare"
            value={flight.firstClassSeatFare}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button className='btn' type="submit">Add Flight</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddFlight;
