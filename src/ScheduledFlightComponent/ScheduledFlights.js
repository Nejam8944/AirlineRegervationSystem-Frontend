import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useLocation } from 'react-router-dom';
import './ScheduledFlights.css';
import NavbarForUser from '../Components/NavbarForUser';

const ScheduledFlights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [airports, setAirports] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:8080/flight/all')
      .then(response => {
        setFlights(response.data);
        setFilteredFlights(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the flight data!', error);
      });

    axios.get('http://localhost:8080/airport/all')
      .then(response => {
        setAirports(response.data.map(airport => airport.airportLocation));
      })
      .catch(error => {
        console.error('There was an error fetching the airport data!', error);
      });
  }, []);

  useEffect(() => {
    if (location.state && location.state.updatedFlight) {
      const updatedFlight = location.state.updatedFlight;
      setFlights(prevFlights => prevFlights.map(flight => 
        flight.flightNumber === updatedFlight.flightNumber ? updatedFlight : flight
      ));
      setFilteredFlights(prevFlights => prevFlights.map(flight => 
        flight.flightNumber === updatedFlight.flightNumber ? updatedFlight : flight
      ));
    }
  }, [location.state]);

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

    setFilteredFlights(result);
  };

  const handleBookSeat = (flight) => {
    navigate('user/bookFlight', { state: { flight } });
  };

  return (
    <div>
      <NavbarForUser />
      <div className="scheduled-flights">
        <h2>Scheduled Flights</h2>
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
          <button onClick={handleSearch} className='btn'>Search</button>
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
              <th>Action</th>
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
                <td>
                  {flight.availableSeatOfEconomyClass === 0 ? (
                    <span className="not-available">Not Available</span>
                  ) : (
                    <>
                      {flight.economySeatFare} <span className="available-seats">Available: {flight.availableSeatOfEconomyClass}</span>
                    </>
                  )}
                </td>
                <td>
                  {flight.availableSeatOfBusinessClass === 0 ? (
                    <span className="not-available">Not Available</span>
                  ) : (
                    <>
                      {flight.businessSeatFare} <span className="available-seats">Available: {flight.availableSeatOfBusinessClass}</span>
                    </>
                  )}
                </td>
                <td>
                  {flight.availableSeatOfFirstClass === 0 ? (
                    <span className="not-available">Not Available</span>
                  ) : (
                    <>
                      {flight.firstClassSeatFare} <span className="available-seats">Available: {flight.availableSeatOfFirstClass}</span>
                    </>
                  )}
                </td>
                <td>{flight.flightStatus}</td>
                <td>
                  <button onClick={() => handleBookSeat(flight)} className='btn'>Book Seat</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduledFlights;
