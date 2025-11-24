'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';

type PaymentMethod = 'card' | 'upi' | 'wallet';

export default function PaymentPage() {
  const router = useRouter();
  const { booking, saveConfirmation, resetBooking, updateBooking, hydrated: bookingHydrated } = useBooking();
  const { recordBooking, user, hydrated: authHydrated } = useAuth();

  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authHydrated || !bookingHydrated) return;
    if (!user) {
      router.push('/signin');
      return;
    }
    if (!booking.seats.length) {
      router.push('/seat-selection');
    }
  }, [authHydrated, bookingHydrated, booking.seats.length, router, user]);

  const handlePay = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!booking.seats.length) return;

    if (method === 'card' && (cardNumber.length < 16 || cvv.length < 3)) {
      alert('Please enter valid card details.');
      return;
    }

    if (method === 'upi' && !upiId.includes('@')) {
      alert('Please enter a valid UPI ID.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const confirmation = {
        bookingId: `MTX-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        paymentMethod: method,
      };

      const snapshot = {
        booking: {
          ...booking,
          paymentMethod: method,
        },
        confirmation,
      };

      saveConfirmation(snapshot);
      updateBooking({ paymentMethod: method });

      recordBooking({
        movie: booking.selectedMovie?.name ?? 'Unknown Movie',
        theatre: booking.theatreName ?? 'Unknown Theatre',
        seats: booking.seats,
        amount: booking.totalAmount,
        status: 'confirmed',
      });

      resetBooking();
      router.push('/booking-confirmation');
    }, 1000);
  };

  return (
    <section className="payment-section">
      <div className="payment-container">
        <h2 className="section-title">Complete Your Payment</h2>

        <div className="payment-content">
          <div className="booking-details">
            <h3>Booking Details</h3>
            <div className="detail-row">
              <span>Movie:</span>
              <strong>{booking.selectedMovie?.name ?? '—'}</strong>
            </div>
            <div className="detail-row">
              <span>Theatre:</span>
              <strong>{booking.theatreName ?? '—'}</strong>
            </div>
            <div className="detail-row">
              <span>Seats:</span>
              <strong>{booking.seats.join(', ') || '—'}</strong>
            </div>
            <div className="detail-row">
              <span>Amount:</span>
              <strong>₹{booking.totalAmount}</strong>
            </div>
          </div>

          <div className="payment-form">
            <h3>Payment Method</h3>
            <form id="paymentForm" onSubmit={handlePay}>
              <div className="payment-methods">
                {['card', 'upi', 'wallet'].map((option) => (
                  <label className="payment-method-option" key={option}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option}
                      checked={method === option}
                      onChange={() => setMethod(option as PaymentMethod)}
                    />
                    <span>{option === 'card' ? 'Credit/Debit Card' : option.toUpperCase()}</span>
                  </label>
                ))}
              </div>

              {method === 'card' && (
                <div id="cardForm" className="form-section">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={3}
                      value={cvv}
                      onChange={(event) => setCvv(event.target.value)}
                    />
                  </div>
                </div>
              )}

              {method === 'upi' && (
                <div id="upiForm" className="form-section">
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input
                      type="email"
                      placeholder="example@upi"
                      value={upiId}
                      onChange={(event) => setUpiId(event.target.value)}
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

