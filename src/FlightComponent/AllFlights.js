import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import 'react-datepicker/dist/react-datepicker.css';
import './AllFlights.css';
import NavbarForAdmin from '../Components/NavbarForAdmin';

const AllFlights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [airplanes, setAirplanes] = useState([]);
  const [airplane, setAirplane] = useState('');
  const [airports, setAirports] = useState([]);
  const [flightStatus, setFlightStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://airlineregervationsystem-backend.onrender.com/flight/all')
      .then(response => {
        setFlights(response.data);
        setFilteredFlights(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the flight data!', error);
      });

    axios.get('https://airlineregervationsystem-backend.onrender.com/airplane/all')
      .then(response => {
        setAirplanes(response.data.map(plane => plane.airplaneName));
      })
      .catch(error => {
        console.error('There was an error fetching the airplane data!', error);
      });

    axios.get('https://airlineregervationsystem-backend.onrender.com/airport/all')
      .then(response => {
        setAirports(response.data.map(airport => airport.airportLocation));
      })
      .catch(error => {
        console.error('There was an error fetching the airport data!', error);
      });
  }, []);

  const handleSearch = () => {
    let result = flights;

    if (startDate) {
      result = result.filter(flight => new Date(flight.departureTime) >= startDate);
    }

    if (endDate) {
      result = result.filter(flight => new Date(flight.departureTime) <= endDate);
    }

    if (fromAirport) {
      result = result.filter(flight => flight.departureAirport.toLowerCase().includes(fromAirport.toLowerCase()));
    }

    if (toAirport) {
      result = result.filter(flight => flight.arrivalAirport.toLowerCase().includes(toAirport.toLowerCase()));
    }

    if (airplane) {
      result = result.filter(flight => flight.airplane.toLowerCase().includes(airplane.toLowerCase()));
    }

    if (flightStatus) {
      result = result.filter(flight => flight.flightStatus.toLowerCase() === flightStatus.toLowerCase());
    }

    setFilteredFlights(result);
  };

  const handleDelete = (flightNumber) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      axios.delete(`https://airlineregervationsystem-backend.onrender.com/flight/delete/${flightNumber}`)
        .then(response => {
          setFlights(flights.filter(flight => flight.flightNumber !== flightNumber));
          setFilteredFlights(filteredFlights.filter(flight => flight.flightNumber !== flightNumber));
          alert('Flight deleted successfully');
        })
        .catch(error => {
          console.error('There was an error deleting the flight!', error);
        });
    }
  };

  const handleUpdate = (flight) => {
    navigate('/admin/updateFlight', { state: { flight } });
  };

  return (
    <div><NavbarForAdmin/>
    <div className="all-flights">
      <h2>All Flights</h2>
      <div className="filter-container">
        <div className="filter-item">
          <label>Select Start Date</label>
          <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat="dd-MM-yyyy" />
        </div>
        <div className="filter-item">
          <label>Select End Date</label>
          <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat="dd-MM-yyyy" />
        </div>
        <div className="filter-item">
          <label>From Airport</label>
          <select value={fromAirport} onChange={e => setFromAirport(e.target.value)}>
            <option value="">Select Source Airport</option>
            {airports.map((airport, index) => (
              <option key={index} value={airport}>{airport}</option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>To Airport</label>
          <select value={toAirport} onChange={e => setToAirport(e.target.value)}>
            <option value="">Select Destination Airport</option>
            {airports.map((airport, index) => (
              <option key={index} value={airport}>{airport}</option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Airplane</label>
          <select value={airplane} onChange={e => setAirplane(e.target.value)}>
            <option value="">Select Airplane</option>
            {airplanes.map((plane, index) => (
              <option key={index} value={plane}>{plane}</option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Flight Status</label>
          <select value={flightStatus} onChange={e => setFlightStatus(e.target.value)}>
            <option value="">Select Flight Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="delayed">Delayed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        <button className='btn' onClick={handleSearch}>Search</button>
      </div>
      <table className="flights-table">
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Airplane</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Departure Airport</th>
            <th>Arrival Airport</th>
            <th>Economy Fare (Rs.)</th>
            <th>Business Fare (Rs.)</th>
            <th>First Class Fare (Rs.)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFlights.map(flight => (
            <tr key={flight.flightNumber}>
              <td>{flight.flightNumber}</td>
              <td>{flight.airplane}</td>
              <td>{new Date(flight.departureTime).toLocaleString()}</td>
              <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
              <td>{flight.departureAirport}</td>
              <td>{flight.arrivalAirport}</td>
              <td>{flight.economySeatFare}</td>
              <td>{flight.businessSeatFare}</td>
              <td>{flight.firstClassSeatFare}</td>
              <td>{flight.flightStatus}</td>
              <td className="actions">
                <button className="update-btn" onClick={() => handleUpdate(flight)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(flight.flightNumber)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default AllFlights;
