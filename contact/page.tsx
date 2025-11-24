'use client';

import { FormEvent, useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [success, setSuccess] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({ ...form, date: new Date().toISOString() });
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    setSuccess('Message sent successfully! We will get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2 className="section-title">Get In Touch</h2>

        <div className="contact-content">
          <div className="contact-form">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  required
                  value={form.subject}
                  onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  placeholder="Your message..."
                  rows={5}
                  required
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
              {success && <p style={{ marginTop: '1rem', color: '#4ecdc4' }}>{success}</p>}
            </form>
          </div>

          <div className="contact-info">
            <h3>Contact Information</h3>

            <div className="info-box">
              <h4>Email Support</h4>
              <p>
                <a href="mailto:support@movietix.com">support@movietix.com</a>
              </p>
            </div>

            <div className="info-box">
              <h4>Phone Support</h4>
              <p>
                <a href="tel:+919876543210">+91 9876543210</a>
              </p>
              <p>Monday - Friday: 9AM - 9PM</p>
              <p>Saturday - Sunday: 10AM - 10PM</p>
            </div>

            <div className="info-box">
              <h4>Office Address</h4>
              <p>MovieTix Entertainment Pvt Ltd</p>
              <p>123 Cinema Street</p>
              <p>Mumbai, India 400001</p>
            </div>

            <div className="info-box">
              <h4>FAQ</h4>
              <ul>
                <li>
                  <a href="#faq">How to book tickets?</a>
                </li>
                <li>
                  <a href="#faq">Refund Policy</a>
                </li>
                <li>
                  <a href="#faq">Payment Methods</a>
                </li>
                <li>
                  <a href="#faq">Technical Support</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

