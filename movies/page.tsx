'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MOVIES, slugify } from '@/lib/movies';

const GENRES = [
  { label: 'All Genres', value: '' },
  { label: 'Sci-Fi', value: 'sci-fi' },
  { label: 'Horror', value: 'horror' },
  { label: 'Romance', value: 'romance' },
  { label: 'Action', value: 'action' },
];

export default function MoviesPage() {
  const [genre, setGenre] = useState('');
  const [search, setSearch] = useState('');

  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      const matchesGenre = genre ? movie.genre === genre : true;
      const matchesSearch = movie.name.toLowerCase().includes(search.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [genre, search]);

  return (
    <section className="movies-section">
      <div className="movies-content">
        <h2 className="section-title">All Movies</h2>

        <div className="filter-bar">
          <select value={genre} onChange={(event) => setGenre(event.target.value)}>
            {GENRES.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search movies..."
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="movies-grid" id="moviesGrid">
          {filteredMovies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <div className="movie-poster" style={{ backgroundImage: `url('${movie.poster}')` }} />
              <div className="movie-info">
                <h3 className="movie-title">{movie.name}</h3>
                <div className="movie-genre">
                  {movie.genre.charAt(0).toUpperCase() + movie.genre.slice(1)}
                </div>
                <div style={{ margin: '1rem 0', fontSize: '0.9rem' }}>
                  <p>⭐ {movie.rating}/10</p>
                  <p>Duration: {movie.duration}</p>
                </div>
                <Link
                  href={`/movies/${slugify(movie.name)}`}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem', textAlign: 'center' }}
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
          {filteredMovies.length === 0 && (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No movies match your search.</p>
          )}
        </div>
      </div>
    </section>
  );
}

