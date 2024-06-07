import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './BookedTicketComponent.css';
import NavbarForUser from '../Components/NavbarForUser';
import { useAuth } from '../Components/AuthContext';
import PasswordPrompt from '../PromptComponent/PasswordPrompt';


const BookedTicketComponent = () => {
  const [tickets, setTickets] = useState([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState(null);
  const { auth } = useAuth();
  const userEmail = auth?.email; // Assuming `auth` contains an `email` property
  const userRole = auth?.role; // Assuming `auth` contains a `role` property

  useEffect(() => {
    if (userEmail) {
      axios.get(`http://localhost:8080/users/tickets/all?email=${userEmail}`)
        .then(response => {
          const sortedTickets = response.data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
          setTickets(sortedTickets);
        })
        .catch(error => {
          console.error('Error fetching tickets:', error);
        });
    }
  }, [userEmail]);

  const deriveBookingId = (ticketId) => {
    // Assuming ticketId is in the format: "http://localhost:8080/tickets/{bookingId}"
    const bookingId = ticketId.substring(24).toUpperCase();
    return bookingId;
  };

  const handleCancelTicket = (ticketId) => {
    setTicketToCancel(ticketId);
    setShowPasswordPrompt(true);
  };
  
  const handleConfirmCancel = (password) => {
    axios.post('http://localhost:8080/users/authenticate', {
      email: userEmail,
      password: password,
      userRole: userRole,
    })
    .then(response => {
      if (response.status === 200) {
        axios.put(`http://localhost:8080/tickets/cancel/${ticketToCancel}`)
          .then(response => {
            // Update tickets state to reflect cancellation
            setTickets(tickets.map(ticket => 
              ticket.ticketId === ticketToCancel ? { ...ticket, status: 'Canceled' } : ticket
            ));
            setShowPasswordPrompt(false);
            setTicketToCancel(null);
          })
          .catch(error => {
            console.error('Error cancelling ticket:', error);
          });
      } else {
        alert('Authentication failed. Ticket cancellation aborted.');
        setShowPasswordPrompt(false);
        setTicketToCancel(null);
      }
    })
    .catch(error => {
      console.error('Error during authentication:', error);
      alert('Authentication failed. Ticket cancellation aborted.');
      setShowPasswordPrompt(false);
      setTicketToCancel(null);
    });
  };
  

  const handleCancelPasswordPrompt = () => {
    setShowPasswordPrompt(false);
    setTicketToCancel(null);
  };

  const handleDownloadTicket = (flightId) => {
    axios.get(`http://localhost:8080/tickets/confirmed/flight/${flightId}`)
      .then(response => {
        const tickets = response.data;
  
        if (tickets.length === 0) {
          console.error('No tickets found for this flight.');
          return;
        }
  
        const flight = tickets[0].flight;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Flight Ticket Details', 14, 22);
        doc.setFontSize(12);
        doc.text(`Flight Number: ${flight.flightNumber || 'Not Available'}`, 14, 30);
  
        doc.text('Flight Details', 14, 44);
        doc.setFontSize(10);
        doc.text(`Airplane: ${flight.airplane || 'Not Available'}`, 14, 50);
        doc.text(`Departure Airport: ${flight.departureAirport || 'Not Available'}`, 14, 56);
        doc.text(`Arrival Airport: ${flight.arrivalAirport || 'Not Available'}`, 14, 62);
        doc.text(`Departure Time: ${flight.departureTime ? new Date(flight.departureTime).toLocaleString() : 'Not Available'}`, 14, 68);
        doc.text(`Arrival Time: ${flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleString() : 'Not Available'}`, 14, 74);

        doc.text('Booked Flight Seat Details', 14, 88);
        doc.autoTable({
          startY: 92,
          head: [['Flight Seat', 'Price', 'Booking Date', 'Status']],
          body: tickets.map(ticket => [
            ticket.seatNumber || 'Not Available',
            ticket.seatFare || 'Not Available',
            ticket.bookingTime ? new Date(ticket.bookingTime).toLocaleString() : 'Not Available',
            ticket.status || 'Not Available'
          ]),
        });
  
        doc.save(`flight_${flight.flightNumber}_tickets.pdf`);
      })
      .catch(error => {
        console.error('Error downloading tickets:', error);
        // Handle specific errors or log them as needed
      });
  };
  
  
  

  return (
    <div>
      <NavbarForUser />
      <div className="booked-tickets">
        <h2>Booked Tickets</h2>
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Booking Id</th>
              <th>Flight Number</th>
              <th>Airplane</th>
              <th>Departure Time</th>
              <th>Arrival Time</th>
              <th>Source Airport</th>
              <th>Destination Airport</th>
              <th>Flight Class</th>
              <th>Seat Fare (Rs.)</th>
              <th>Seat No</th>
              <th>Booking Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.ticketId}>
                <td>{deriveBookingId(ticket.ticketId)}</td>
                <td>{ticket.flight.flightNumber}</td>
                <td>{ticket.flight.airplane}</td>
                <td>{new Date(ticket.flight.departureTime).toLocaleString()}</td>
                <td>{new Date(ticket.flight.arrivalTime).toLocaleString()}</td>
                <td>{ticket.flight.departureAirport}</td>
                <td>{ticket.flight.arrivalAirport}</td>
                <td>{ticket.flightClass}</td>
                <td>{ticket.seatFare}</td>
                <td>{ticket.seatNumber}</td>
                <td>{new Date(ticket.bookingTime).toLocaleString()}</td>
                <td>{ticket.status}</td>
                <td>
                  {ticket.status !== 'Canceled' && (
                    <>
                      <button onClick={() => handleCancelTicket(ticket.ticketId)} className="btn cancel-btn">Cancel Ticket</button>
                      <button onClick={() => handleDownloadTicket(ticket.flight.flightNumber)} className="btn download-btn">Download Ticket</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPasswordPrompt && (
        <PasswordPrompt
          onConfirm={handleConfirmCancel}
          onCancel={handleCancelPasswordPrompt}
        />
      )}
    </div>
  );
};

export default BookedTicketComponent;
