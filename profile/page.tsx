'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, currentUserRecord, logout, updateProfile, hydrated } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'details'>('bookings');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  useEffect(() => {
    if (hydrated && !user) {
      router.push('/signin');
    }
  }, [hydrated, router, user]);

  useEffect(() => {
    if (currentUserRecord) {
      setPhone(currentUserRecord.phone ?? '');
      setDob(currentUserRecord.dob ?? '');
    }
  }, [currentUserRecord]);

  const bookings = useMemo(() => currentUserRecord?.bookings ?? [], [currentUserRecord]);

  const handleProfileUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile({ phone, dob });
    alert('Profile updated successfully!');
  };

  if (!user) {
    return null;
  }

  const initials = (user.firstName[0] + (user.lastName?.[0] ?? 'U')).toUpperCase();

  return (
    <section className="profile-section">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h2>
              {user.firstName} {user.lastName}
            </h2>
            <p>{user.email}</p>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            My Bookings
          </button>
          <button className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
            Personal Details
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'bookings' && (
            <div id="bookings" className="tab-pane active">
              <h3>Your Bookings</h3>
              <div className="bookings-list">
                {bookings.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>No bookings yet</p>
                ) : (
                  bookings.map((booking) => (
                    <div className="booking-item" key={booking.id}>
                      <div className="booking-item-header">
                        <div className="booking-item-title">{booking.movie}</div>
                        <div className="booking-item-status">{booking.status}</div>
                      </div>
                      <div className="booking-item-details">
                        <div className="booking-item-detail">
                          <strong>Theatre:</strong> {booking.theatre}
                        </div>
                        <div className="booking-item-detail">
                          <strong>Seats:</strong> {booking.seats.join(', ')}
                        </div>
                        <div className="booking-item-detail">
                          <strong>Amount:</strong> ₹{booking.amount}
                        </div>
                        <div className="booking-item-detail">
                          <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div id="details" className="tab-pane active">
              <h3>Personal Details</h3>
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={user.email} readOnly />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Enter phone number" />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" value={dob} onChange={(event) => setDob(event.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

