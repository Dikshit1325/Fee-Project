import Link from 'next/link';
import { MOVIES, slugify } from '@/lib/movies';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Your Movie Adventure Starts Here</h1>
          <p className="hero-subtitle">
            Book tickets instantly, choose your perfect seats, and enjoy the ultimate cinema experience
          </p>
          <div className="hero-cta">
            <Link href="/movies" className="btn btn-primary btn-hero">
              Explore Movies
            </Link>
            <Link href="/nearby-theatres" className="btn btn-secondary btn-hero">
              Find Theatres
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Now Showing</h2>
        <div className="movies-grid">
          {MOVIES.slice(0, 4).map((movie) => (
            <div className="movie-card" key={movie.id}>
              <div className="movie-poster" style={{ backgroundImage: `url('${movie.poster}')` }} />
              <div className="movie-info">
                <h3 className="movie-title">{movie.name}</h3>
                <div className="movie-genre">
                  {movie.genre.charAt(0).toUpperCase() + movie.genre.slice(1)} • {movie.duration}
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
        </div>
      </section>
    </>
  );
}
