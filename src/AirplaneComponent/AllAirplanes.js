import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllAirplanes.css'; // Make sure to create this CSS file
import NavbarForAdmin from '../Components/NavbarForAdmin';

const AllAirplanes = () => {
  const [airplanes, setAirplanes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/airplane/all')
      .then(response => {
        console.log(response.data);
        setAirplanes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the airplane data!', error);
      });
  }, []);

  return (
    <div>
      <NavbarForAdmin />
      <div className="all-airplanes">
        <h2>All Airplanes</h2>
        <table className="airplanes-table">
          <thead>
            <tr>
              <th>Registration Number</th>
              <th>Airplane Name</th>
              <th>Description</th>
              <th>Total Seats</th>
              <th>Total Economy Seats</th>
              <th>Total Business Seats</th>
              <th>Total First Class Seats</th> {/* New column added here */}
            </tr>
          </thead>
          <tbody>
            {airplanes.map(airplane => (
              <tr key={airplane.registrationNumber}>
                <td>{airplane.registrationNumber}</td>
                <td>{airplane.airplaneName}</td>
                <td>{airplane.airplaneDescription}</td>
                <td>{airplane.totalSeat}</td>
                <td>{airplane.totalEconomyClassSeat}</td>
                <td>{airplane.totalBusinessClassSeat}</td>
                <td>{airplane.totalFirstClassSeat}</td> {/* New column data here */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAirplanes;
