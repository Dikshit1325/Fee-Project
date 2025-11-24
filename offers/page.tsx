import Link from 'next/link';

const OFFERS = [
  {
    badge: '25% OFF',
    title: 'Weekend Bonanza',
    description: 'Get 25% discount on all bookings from Friday to Sunday',
    validTill: 'Dec 31, 2025',
  },
  {
    badge: 'BUY 2 GET 1',
    title: 'Group Offer',
    description: 'Book 2 tickets and get 1 free for group bookings',
    validTill: 'Dec 25, 2025',
  },
  {
    badge: '₹100 OFF',
    title: 'Student Discount',
    description: 'Special discount of ₹100 on every ticket with valid student ID',
    validTill: 'Jan 15, 2026',
  },
  {
    badge: 'CASHBACK',
    title: 'Wallet Rewards',
    description: 'Get 10% cashback on all UPI and wallet payments',
    validTill: 'Dec 31, 2025',
  },
];

export default function OffersPage() {
  return (
    <section className="offers-section">
      <div className="offers-content">
        <h2 className="section-title">Special Offers &amp; Deals</h2>
        <div className="offers-grid">
          {OFFERS.map((offer) => (
            <div className="offer-card" key={offer.title}>
              <div className="offer-badge">{offer.badge}</div>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <div className="offer-details">Valid till: {offer.validTill}</div>
              <Link href="/movies" className="btn btn-primary">
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

