'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';

const ROWS = 10;
const COLS = 15;
const SEAT_PRICE = 250;

interface Seat {
  id: string;
  occupied: boolean;
}

const buildSeatMap = (): Seat[] => {
  const seats: Seat[] = [];
  for (let i = 0; i < ROWS * COLS; i += 1) {
    const rowLetter = String.fromCharCode(65 + Math.floor(i / COLS));
    const seatNumber = (i % COLS) + 1;
    seats.push({
      id: `${rowLetter}${seatNumber}`,
      occupied: Math.random() < 0.2,
    });
  }
  return seats;
};

export default function SeatSelectionPage() {
  const router = useRouter();
  const { booking, updateBooking, hydrated } = useBooking();
  const [seats] = useState(buildSeatMap);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(booking.seats || []);

  const selectedMovieName = booking.selectedMovie?.name ?? 'Movie not selected';

  useEffect(() => {
    if (!hydrated) return;
    if (!booking.selectedMovie || !booking.theatreName) {
      router.push('/movies');
    }
  }, [booking.selectedMovie, booking.theatreName, hydrated, router]);

  const totalPrice = useMemo(() => selectedSeats.length * SEAT_PRICE, [selectedSeats.length]);

  const toggleSeat = (seat: Seat) => {
    if (seat.occupied) return;
    setSelectedSeats((prev) =>
      prev.includes(seat.id) ? prev.filter((value) => value !== seat.id) : [...prev, seat.id]
    );
  };

  const proceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat before proceeding.');
      return;
    }

    updateBooking({
      seats: selectedSeats,
      totalAmount: totalPrice,
      regularCount: selectedSeats.length,
      vipCount: 0,
    });

    router.push('/payment');
  };

  return (
    <section className="seat-selection-section">
      <div className="seat-container">
        <h2 className="section-title">Select Your Seats</h2>
        <div className="seat-info">
          <p>Movie: {selectedMovieName}</p>
          <p>Theatre: {booking.theatreName ?? 'Not selected'}</p>
          <p>Show Time: {booking.showTime ?? 'Select from theatre'}</p>
        </div>

        <div className="screen">SCREEN</div>

        <div className="seats-grid">
          {seats.map((seat) => {
            const isSelected = selectedSeats.includes(seat.id);
            return (
              <button
                type="button"
                key={seat.id}
                className={`seat ${seat.occupied ? 'occupied' : isSelected ? 'selected' : 'available'}`}
                onClick={() => toggleSeat(seat)}
                disabled={seat.occupied}
              >
                {seat.id}
              </button>
            );
          })}
        </div>

        <div className="seat-legend">
          <div className="legend-item">
            <span className="seat available" /> Available
          </div>
          <div className="legend-item">
            <span className="seat selected" /> Selected
          </div>
          <div className="legend-item">
            <span className="seat occupied" /> Occupied
          </div>
        </div>

        <div className="booking-summary">
          <div className="summary-info">
            <p>
              Selected Seats: <strong>{selectedSeats.length ? selectedSeats.join(', ') : 'None'}</strong>
            </p>
            <p>
              Price per seat: <strong>₹{SEAT_PRICE}</strong>
            </p>
            <p>
              Total: <strong>₹{totalPrice}</strong>
            </p>
          </div>
          <button className="btn btn-primary" onClick={proceedToPayment} disabled={selectedSeats.length === 0}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </section>
  );
}

