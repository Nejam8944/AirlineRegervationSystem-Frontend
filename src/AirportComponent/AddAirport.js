import React, { useState } from 'react';
import axios from 'axios';
import './AddAirport.css';
import NavbarForAdmin from '../Components/NavbarForAdmin';

const AddAirport = () => {
  const [airport, setAirport] = useState({
    airportName: '',
    airportLocation: '',
    airportCode: '',
    airportAddress: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAirport((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://airlineregervationsystem-backend.onrender.com/airport/add', airport)
      .then((response) => {
        console.log(response.data);
        alert('Airport added successfully');
        setAirport({
          airportName: '',
          airportLocation: '',
          airportCode: '',
          airportAddress: '',
        });
      })
      .catch((error) => {
        console.error('There was an error adding the airport!', error);
      });
  };

  return (
    <div><NavbarForAdmin/>
    <div className="add-airport">
      <h2>Add Airport</h2>
      <form onSubmit={handleSubmit} className="add-airport-form">
        <div className="form-group">
          <label>Airport Name</label>
          <input
            type="text"
            name="airportName"
            value={airport.airportName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Airport Location</label>
          <input
            type="text"
            name="airportLocation"
            value={airport.airportLocation}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Airport Code</label>
          <input
            type="text"
            name="airportCode"
            value={airport.airportCode}
            onChange={handleChange}
          />
        </div>
        <div className="form-group form-group-full">
          <label>Airport Address</label>
          <textarea
            name="airportAddress"
            value={airport.airportAddress}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button className='btn' type="submit">Add Airport</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddAirport;
