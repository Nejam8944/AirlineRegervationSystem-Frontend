import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Components/AuthContext';
import './BookFlightComponent.css';
import NavbarForUser from '../Components/NavbarForUser';

const BookFlightComponent = () => {
  const location = useLocation();
  const { flight } = location.state;
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [flightData, setFlightData] = useState({
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

  const [totalPassengers, setTotalPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState('');
  const [formErrors, setFormErrors] = useState({
    totalPassengers: false,
    flightClass: false,
  });

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (flight) {
      setFlightData({
        airplane: flight.airplane || '',
        departureAirport: flight.departureAirport || '',
        arrivalAirport: flight.arrivalAirport || '',
        flightStatus: flight.flightStatus || '',
        departureTime: flight.departureTime ? new Date(flight.departureTime).toLocaleString() : '',
        arrivalTime: flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleString() : '',
        economySeatFare: flight.economySeatFare || 0,
        businessSeatFare: flight.businessSeatFare || 0,
        firstClassSeatFare: flight.firstClassSeatFare || 0,
      });
    }

    if (auth) {
      axios.get(`https://airlineregervationsystem-backend.onrender.com/users/wallet/balance/${auth.email}`)
        .then(response => {
          setBalance(response.data);
        })
        .catch(error => {
          console.error('Error fetching wallet balance:', error);
        });
    }
  }, [flight, auth]);

  const handleBooking = () => {
    const errors = {
      totalPassengers: totalPassengers <= 0,
      flightClass: !flightClass,
    };
  
    setFormErrors(errors);
  
    if (!errors.totalPassengers && !errors.flightClass) {
      const fare =
        flightClass === 'Economy' ? flightData.economySeatFare :
        flightClass === 'Business' ? flightData.businessSeatFare :
        flightData.firstClassSeatFare;
  
      const totalFare = fare * totalPassengers;
  
      if (balance >= totalFare) {
        const ticketBookingData = {
          email: auth.email,
          flightNumber: flight.flightNumber,
          flightClass,
          totalPassengers,
        };
  
        axios.post(`https://airlineregervationsystem-backend.onrender.com/tickets/book`, ticketBookingData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          axios.put(`https://airlineregervationsystem-backend.onrender.com/flight/update/availableSeat`, flight, {
            params: {
              classType: flightClass,
              totalPassengers,
            },
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(() => {
            // Handle success
            alert('Booked successfully');
            // Update local flight data to reflect the new available seat count
            const updatedFlight = {
              ...flight,
              availableSeatOfEconomyClass: flight.availableSeatOfEconomyClass - (flightClass === 'Economy' ? totalPassengers : 0),
              availableSeatOfBusinessClass: flight.availableSeatOfBusinessClass - (flightClass === 'Business' ? totalPassengers : 0),
              availableSeatOfFirstClass: flight.availableSeatOfFirstClass - (flightClass === 'First Class' ? totalPassengers : 0),
            };
            navigate('/scheduled-flights', { state: { updatedFlight } });
          })
          .catch(error => {
            console.error('Error updating available seat:', error);
            alert('There was an error while updating the available seat.');
          });
        })
        .catch(error => {
          console.error('Error booking ticket:', error);
          alert('There was an error while booking.');
        });
      } else {
        alert('Balance is low, please load the balance in wallet.');
      }
    } else {
      alert('Please fill in all required fields correctly.');
    }
  };
  

  return (
    <div>
      <NavbarForUser />
      <div className="book-flight">
        <h2>Book Flight</h2>
        <div className="form-container">
          <div className={`form-group ${formErrors.totalPassengers ? 'error' : ''}`}>
            <label>Airplane</label>
            <input type="text" value={flightData.airplane} readOnly />
          </div>
          <div className={`form-group ${formErrors.totalPassengers ? 'error' : ''}`}>
            <label>Departure Airport</label>
            <input type="text" value={flightData.departureAirport} readOnly />
          </div>
          <div className={`form-group ${formErrors.totalPassengers ? 'error' : ''}`}>
            <label>Arrival Airport</label>
            <input type="text" value={flightData.arrivalAirport} readOnly />
          </div>
          <div className={`form-group ${formErrors.totalPassengers ? 'error' : ''}`}>
            <label>Flight Status</label>
            <input type="text" value={flightData.flightStatus} readOnly />
          </div>
          <div className={`form-group ${formErrors.totalPassengers ? 'error' : ''}`}>
            <label>Departure Time</label>
            <input type="text" value={flightData.departureTime} readOnly />
          </div>
          <div className={`form-group ${formErrors.totalPassengers ? 'error' : ''}`}>
            <label>Arrival Time</label>
            <input type="text" value={flightData.arrivalTime} readOnly />
          </div>
          <div className={`form-group ${formErrors.totalPassengers ? 'error' : ''}`}>
            <label>Economy Seat Fare</label>
            <input type="text" value={flightData.economySeatFare} readOnly />
          </div>
          <div className={`form-group ${formErrors.totalPassengers ? 'error' : ''}`}>
            <label>Business Seat Fare</label>
            <input type="text" value={flightData.businessSeatFare} readOnly />
          </div>
          <div className={`form-group ${formErrors.totalPassengers ? 'error' : ''}`}>
            <label>First Class Seat Fare</label>
            <input type="text" value={flightData.firstClassSeatFare} readOnly />
          </div>
          <div className={`form-group ${formErrors.totalPassengers || formErrors.flightClass ? 'error' : ''}`}>
            <label>Total Passengers <span className="required">*</span></label>
            <input
              type="number"
              value={totalPassengers}
              onChange={e => setTotalPassengers(Math.max(1, parseInt(e.target.value)))}
              min="1"
              max="10"
              required
              className={formErrors.totalPassengers ? 'error' : ''}
            />
          </div>
          <div className={`form-group ${formErrors.totalPassengers || formErrors.flightClass ? 'error' : ''}`}>
            <label>Flight Class Type <span className="required">*</span></label>
            <select
              value={flightClass}
              onChange={e => setFlightClass(e.target.value)}
              required
              className={formErrors.flightClass ? 'error' : ''}
            >
              <option value="">Select Flight Class</option>
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First Class">First Class</option>
            </select>
          </div>
        </div>
        <button onClick={handleBooking} className="btn">Book Ticket</button>
      </div>
    </div>
  );
};

export default BookFlightComponent;
