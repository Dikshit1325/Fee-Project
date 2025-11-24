'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOVIES, slugify } from '@/lib/movies';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';

export default function MovieDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { updateBooking } = useBooking();

  const movie = useMemo(
    () => MOVIES.find((item) => slugify(item.name) === params.slug),
    [params.slug]
  );

  if (!movie) {
    return (
      <section className="movie-detail-section">
        <div className="movie-detail-container">
          <p>Movie not found.</p>
        </div>
      </section>
    );
  }

  const handleSelectTheatre = () => {
    if (!user) {
      router.push('/signin');
      return;
    }

    updateBooking({
      selectedMovie: movie,
      seats: [],
      totalAmount: 0,
      regularCount: 0,
      vipCount: 0,
    });

    router.push('/nearby-theatres');
  };

  return (
    <section className="movie-detail-section">
      <div className="movie-detail-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <div
              style={{
                height: '500px',
                backgroundImage: `url('${movie.poster}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '15px',
              }}
            />
          </div>
          <div>
            <h1>{movie.name}</h1>
            <p style={{ color: '#4ecdc4', margin: '1rem 0' }}>
              {movie.genre.charAt(0).toUpperCase() + movie.genre.slice(1)} • {movie.duration}
            </p>
            <p style={{ margin: '1rem 0' }}>
              <strong>⭐ Rating:</strong> {movie.rating}/10
            </p>
            <p style={{ margin: '1rem 0' }}>
              <strong>Release Date:</strong> {movie.releaseDate}
            </p>
            <p style={{ margin: '1rem 0' }}>
              <strong>Cast:</strong> {movie.cast}
            </p>
            <p style={{ margin: '1rem 0', lineHeight: 1.6 }}>{movie.description}</p>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }} onClick={handleSelectTheatre}>
              Select Theatre &amp; Book
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

