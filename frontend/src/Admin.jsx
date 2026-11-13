
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Failed to load bookings");
        }

        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">S</span>
          <span>
            Service<span className="brand-accent">Spot</span>
          </span>
        </a>

        <Link to="/" className="provider-button">
          Back to Website
        </Link>
      </header>

      <main>
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ADMIN PANEL</span>
              <h2>Customer Bookings</h2>
              <p>Total bookings: {bookings.length}</p>
            </div>
          </div>

          {loading ? (
            <p>Loading bookings...</p>
          ) : error ? (
            <p>{error}</p>
          ) : bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <div className="provider-grid">
              {bookings.map((booking) => (
                <article
                  className="provider-card"
                  key={booking._id}
                >
                  <h3>{booking.customerName}</h3>

                  <p>
                    <strong>Service:</strong> {booking.service}
                  </p>

                  <p>
                    <strong>Address:</strong> {booking.address}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      booking.bookingDate
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Requirements:</strong>{" "}
                    {booking.requirements || "None"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>ServiceSpot Admin Dashboard</p>
      </footer>
    </div>
  );
}

export default Admin;

