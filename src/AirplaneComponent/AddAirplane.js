import React, { useState } from 'react';
import axios from 'axios';
import './AddAirplane.css';
import NavbarForAdmin from '../Components/NavbarForAdmin';

const AddAirplane = () => {
  const [airplane, setAirplane] = useState({
    registrationNumber: '',
    airplaneName: '',
    airplaneDescription: '',
    totalEconomyClassSeat: 0,
    totalBusinessClassSeat: 0,
    totalFirstClassSeat: 0,
    totalSeat: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAirplane((prevState) => {
      const updatedAirplane = {
        ...prevState,
        [name]: name.includes('Seat') ? parseInt(value) || 0 : value,
      };
      updatedAirplane.totalSeat =
        updatedAirplane.totalEconomyClassSeat +
        updatedAirplane.totalBusinessClassSeat +
        updatedAirplane.totalFirstClassSeat;
      return updatedAirplane;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://airlineregervationsystem-backend.onrender.com/airplane/add', airplane)
      .then((response) => {
        console.log(response.data);
        alert('Airplane added successfully');
        setAirplane({
          registrationNumber: '',
          airplaneName: '',
          airplaneDescription: '',
          totalEconomyClassSeat: 0,
          totalBusinessClassSeat: 0,
          totalFirstClassSeat: 0,
          totalSeat: 0,
        });
      })
      .catch((error) => {
        console.error('There was an error adding the airplane!', error);
      });
  };

  return (
    <div>
      <NavbarForAdmin />
      <div className="add-airplane">
        <h2>Add Airplane</h2>
        <form onSubmit={handleSubmit} className="add-airplane-form">
          <div className="form-group">
            <label>Registration Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={airplane.registrationNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Airplane Name</label>
            <input
              type="text"
              name="airplaneName"
              value={airplane.airplaneName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Airplane Description</label>
            <input
              type="text"
              name="airplaneDescription"
              value={airplane.airplaneDescription}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Total Economy Seats</label>
            <input
              type="number"
              name="totalEconomyClassSeat"
              value={airplane.totalEconomyClassSeat}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Total Business Seats</label>
            <input
              type="number"
              name="totalBusinessClassSeat"
              value={airplane.totalBusinessClassSeat}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Total First Class Seats</label>
            <input
              type="number"
              name="totalFirstClassSeat"
              value={airplane.totalFirstClassSeat}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Total Seats</label>
            <input
              type="number"
              name="totalSeat"
              value={airplane.totalSeat}
              readOnly
            />
          </div>
          <div className="form-actions">
            <button className='btn' type="submit">Add Airplane</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAirplane;
