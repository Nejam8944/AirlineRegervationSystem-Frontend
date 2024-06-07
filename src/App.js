import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import NavbarForAdmin from './Components/NavbarForAdmin';
import NavbarForUser from './Components/NavbarForUser';
import UserPage from './Components/UserPage';
import AdminPage from './Components/AdminPage';
import { AuthProvider } from './Components/AuthContext';
import PrivateRoute from './Components/PrivateRoute';
import AllAirports from './AirportComponent/AllAirports';
import AddAirport from './AirportComponent/AddAirport';
import AddAirplane from './AirplaneComponent/AddAirplane';
import AllAirplanes from './AirplaneComponent/AllAirplanes';
import AddFlight from './FlightComponent/AddFlight';
import AllFlights from './FlightComponent/AllFlights';
import WalletComponent from './WalletComponent/WalletComponent';
import ScheduledFlights from './ScheduledFlightComponent/ScheduledFlights';
import BookFlightComponent from './FlightComponent/BookFlightComponent';
import UpdateFlight from './FlightComponent/UpdateFlight';
import BookedFlightComponent from './BookedTicketComponent/BookedTicketComponent';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<PrivateRoute role="user"><UserPage /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute role="admin"><AdminPage /></PrivateRoute>} />
            <Route path="/admin/viewAirport" element={<PrivateRoute role="admin"><AllAirports /></PrivateRoute>} />
            <Route path="/admin/addAirport" element={<PrivateRoute role="admin"><AddAirport /></PrivateRoute>} />
            <Route path="/admin/viewAirplane" element={<PrivateRoute role="admin"><AllAirplanes /></PrivateRoute>} />
            <Route path="/admin/addAirplane" element={<PrivateRoute role="admin"><AddAirplane /></PrivateRoute>} />
            <Route path="/admin/addFlight" element={<PrivateRoute role="admin"><AddFlight /></PrivateRoute>} />
            <Route path="/admin/allFlights" element={<PrivateRoute role="admin"><AllFlights /></PrivateRoute>} />
            <Route path="/admin/updateFlight" element={<PrivateRoute role="admin"><UpdateFlight /></PrivateRoute>} />
            <Route path="/user/myWallet" element={<WalletComponent />} />
            <Route path="/scheduled-flights" element={<ScheduledFlights />} />
            <Route path="/scheduled-flights/user/bookFlight" element={<PrivateRoute role="user"><BookFlightComponent /></PrivateRoute>} />
            <Route path="/user/bookedTicket" element={<PrivateRoute role="user"><BookedFlightComponent /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
