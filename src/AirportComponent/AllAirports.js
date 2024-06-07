import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllAirports.css'; // Make sure to create this CSS file
import NavbarForAdmin from '../Components/NavbarForAdmin';

const AllAirports = () => {
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/airport/all')
      .then(response => {
        setAirports(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the airport data!', error);
      });
  }, []);

  return (
    <div><NavbarForAdmin/>
    <div className="all-airports">
      <h2>All Airports</h2>
      <table className="airports-table">
        <thead>
          <tr>
            <th>Airport</th>
            <th>Airport Location</th>
            <th>Airport Code</th>
            <th>Airport Address</th>
          </tr>
        </thead>
        <tbody>
          {airports.map(airport => (
            <tr key={airport.airportCode}>
              <td>{airport.airportName}</td>
              <td>{airport.airportLocation}</td>
              <td>{airport.airportCode}</td>
              <td>{airport.airportAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default AllAirports;
