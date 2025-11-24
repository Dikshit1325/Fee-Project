'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTheatresByCity } from '@/lib/theatres';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';

const CITIES = ['lucknow', 'delhi', 'mumbai'];

export default function NearbyTheatresPage() {
  const [city, setCity] = useState('lucknow');
  const [distance, setDistance] = useState(50);

  const router = useRouter();
  const { booking, updateBooking } = useBooking();
  const { user } = useAuth();

  const theatres = useMemo(() => {
    return getTheatresByCity(city).filter((theatre) => theatre.distance <= distance);
  }, [city, distance]);

  const handleSelect = (theatreId: string, theatreName: string, showTime: string) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    if (!booking.selectedMovie) {
      router.push('/movies');
      return;
    }

    updateBooking({
      theatreId,
      theatreName,
      showTime,
    });

    router.push('/seat-selection');
  };

  return (
    <section className="theatres-section">
      <div className="theatres-content">
        <h2 className="section-title">Find Nearby Theatres</h2>

        <div className="location-selector">
          <div className="location-options">
            {CITIES.map((cityOption) => (
              <button
                key={cityOption}
                className={`location-btn ${cityOption === city ? 'active' : ''}`}
                data-city={cityOption}
                onClick={() => setCity(cityOption)}
              >
                {cityOption.charAt(0).toUpperCase() + cityOption.slice(1)}
              </button>
            ))}
          </div>
          <div className="distance-filter">
            <label>
              Distance: <span id="distanceValue">{distance}</span> km
            </label>
            <input
              id="distanceSlider"
              type="range"
              min="5"
              max="100"
              step="5"
              value={distance}
              onChange={(event) => setDistance(Number(event.target.value))}
            />
          </div>
        </div>

        <div className="theatres-grid">
          {theatres.map((theatre) => (
            <div className="theatre-card" key={theatre.id}>
              <div className="theatre-header">
                <div>
                  <div className="theatre-name">{theatre.name}</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem' }}>{theatre.city}</div>
                </div>
                <div className="theatre-rating">⭐ {theatre.rating}</div>
              </div>
              <div className="theatre-distance">📍 {theatre.distance} km away</div>
              <div className="theatre-details">
                <div className="theatre-detail-item">🎬 {theatre.screens} Screens</div>
              </div>
              <div className="theatre-facilities">
                {theatre.facilities.map((facility) => (
                  <span className="facility-badge" key={facility}>
                    {facility}
                  </span>
                ))}
              </div>
              <div style={{ margin: '1rem 0' }}>
                <strong>Show Times:</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {theatre.showTimes.map((time) => (
                    <button
                      key={time}
                      style={{
                        background: 'rgba(78, 205, 196, 0.2)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '5px',
                        fontSize: '0.85rem',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleSelect(theatre.id, theatre.name, time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {theatres.length === 0 && <p>No theatres within the selected distance.</p>}
        </div>
      </div>
    </section>
  );
}

