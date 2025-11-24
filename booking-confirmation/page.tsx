'use client';

import Link from 'next/link';
import { useBooking } from '@/contexts/BookingContext';

export default function BookingConfirmationPage() {
  const { lastConfirmation } = useBooking();

  if (!lastConfirmation) {
    return (
      <section className="confirmation-section">
        <div className="confirmation-container">
          <div className="success-message">
            <h2>No booking found</h2>
            <p>Please book a ticket to view confirmation details.</p>
            <Link href="/movies" className="btn btn-primary">
              Browse Movies
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const { booking, confirmation } = lastConfirmation;
  const downloadTicket = () => {
    alert(
      `Ticket downloaded!\n\nMovie: ${booking.selectedMovie?.name}\nTheatre: ${booking.theatreName}\nSeats: ${
        booking.seats.join(', ') || 'N/A'
      }\n\nCheck your downloads folder.`
    );
  };

  return (
    <section className="confirmation-section">
      <div className="confirmation-container">
        <div className="success-message">
          <div className="checkmark">✓</div>
          <h2>Booking Confirmed!</h2>
          <p>Your ticket has been successfully booked</p>
        </div>

        <div className="confirmation-details">
          <div className="confirmation-box">
            <h3>Booking Reference</h3>
            <p className="booking-ref">{confirmation.bookingId}</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {new Date(confirmation.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="confirmation-info">
            <div className="info-section">
              <h4>Movie Details</h4>
              <p>
                <strong>Movie:</strong> <span>{booking.selectedMovie?.name}</span>
              </p>
              <p>
                <strong>Genre:</strong>{' '}
                <span>{booking.selectedMovie?.genre?.toUpperCase()}</span>
              </p>
              <p>
                <strong>Duration:</strong> <span>{booking.selectedMovie?.duration}</span>
              </p>
            </div>

            <div className="info-section">
              <h4>Theatre &amp; Timing</h4>
              <p>
                <strong>Theatre:</strong> <span>{booking.theatreName}</span>
              </p>
              <p>
                <strong>Show Time:</strong> <span>{booking.showTime ?? '—'}</span>
              </p>
            </div>

            <div className="info-section">
              <h4>Seats</h4>
              <p>
                <strong>Seats:</strong> <span>{booking.seats.join(', ')}</span>
              </p>
              <p>
                <strong>Total Amount:</strong> <span>₹{booking.totalAmount}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="btn btn-primary" onClick={downloadTicket}>
            Download Ticket
          </button>
          <Link href="/profile" className="btn btn-secondary">
            View My Bookings
          </Link>
          <Link href="/movies" className="btn btn-secondary">
            Book More Tickets
          </Link>
        </div>
      </div>
    </section>
  );
}

