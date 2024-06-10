import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Components/AuthContext'; // Ensure correct import path
import './WalletComponent.css'; // Import your CSS file
import NavbarForUser from '../Components/NavbarForUser';

const WalletComponent = () => {
  const { auth } = useAuth();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (auth) {
      // Fetch the wallet balance from the backend using the new endpoint
      axios.get(`https://airlineregervationsystem-frontend.onrender.com/users/wallet/balance/${auth.email}`)
        .then(response => {
          setBalance(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the wallet balance!', error);
        });
    }
  }, [auth]);

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (auth) {
      // Update the wallet balance in the backend using the new endpoint
      axios.put(`https://airlineregervationsystem-backend.onrender.com/users/update/wallet/balance/${auth.email}/${parseFloat(amount)}`)
        .then(response => {
          // Fetch the updated wallet balance after updating
          return axios.get(`https://airlineregervationsystem-backend.onrender.com/users/wallet/balance/${auth.email}`);
        })
        .then(response => {
          setBalance(response.data);
          setAmount('');
        })
        .catch(error => {
          console.error('There was an error updating the wallet balance!', error);
        });
    }
  };

  return (
    <div><NavbarForUser/>
    <div className="wallet-container">
      <h2>My Wallet</h2>
      <div className="wallet-balance">
        <p>Wallet Balance: Rs {balance}</p>
      </div>
      <div className="wallet-form">
        <h3>Add Money In Wallet</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={handleChange}
              placeholder="Enter amount"
              required
            />
          </div>
          <button  className='btn' type="submit">Update Wallet</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default WalletComponent;
