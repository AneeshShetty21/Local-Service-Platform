
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

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

  async function updateBookingStatus(bookingId, newStatus) {
    try {
      setUpdatingId(bookingId);

      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? data.booking
            : booking
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) =>
      !booking.status || booking.status === "Pending"
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "Accepted"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "Rejected"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = [
      booking.customerName,
      booking.service,
      booking.address
    ].some((value) =>
      (value || "").toLowerCase().includes(search.toLowerCase())
    );

    const status = booking.status || "Pending";

    const matchesStatus =
      filterStatus === "All" || status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const statistics = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: "▤",
      color: "blue"
    },
    {
      title: "Pending",
      value: pendingBookings,
      icon: "◷",
      color: "orange"
    },
    {
      title: "Accepted",
      value: acceptedBookings,
      icon: "✓",
      color: "purple"
    },
    {
      title: "Rejected",
      value: rejectedBookings,
      icon: "×",
      color: "red"
    },
    {
      title: "Completed",
      value: completedBookings,
      icon: "✔",
      color: "green"
    }
  ];

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span className="admin-brand-icon">S</span>
          <span>
            Service<span>Spot</span>
          </span>
        </Link>

        <p className="sidebar-label">MAIN MENU</p>

        <a href="#dashboard" className="sidebar-link active">
          <span>▦</span>
          Dashboard
        </a>

        <a href="#bookings" className="sidebar-link">
          <span>▤</span>
          Bookings
        </a>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="profile-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>ServiceSpot Admin</small>
            </div>
          </div>

          <Link to="/" className="sidebar-logout">
            ← Back to Website
          </Link>
        </div>
      </aside>

      <main className="admin-main">

        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">
              Pages / Dashboard
            </span>
            <h1>Dashboard Overview</h1>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-live-dot"></span>
            <span>System Overview</span>
          </div>
        </header>

        <section className="admin-content" id="dashboard">

          <div className="admin-welcome">
            <div>
              <h2>Welcome back, Admin!</h2>
              <p>
                Here's what's happening with your service bookings.
              </p>
            </div>
            <span className="admin-date">
              ServiceSpot Management
            </span>
          </div>

          <div className="admin-stats-grid">
            {statistics.map((stat) => (
              <div
                className="admin-stat-card"
                key={stat.title}
              >
                <div className={`admin-stat-icon ${stat.color}`}>
                  {stat.icon}
                </div>

                <div>
                  <p>{stat.title}</p>
                  <h2>{stat.value}</h2>
                </div>
              </div>
            ))}
          </div>

          <section className="admin-bookings-section" id="bookings">

            <div className="admin-bookings-heading">
              <div>
                <h2>Customer Bookings</h2>
                <p>
                  View and manage all customer service requests.
                </p>
              </div>

              <span className="admin-booking-count">
                {filteredBookings.length} bookings
              </span>
            </div>

            <div className="admin-toolbar">
              <div className="admin-search">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="Search customer, service or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="admin-filter"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value)
                }
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {loading ? (
              <div className="admin-message">
                Loading bookings...
              </div>
            ) : error ? (
              <div className="admin-message admin-error">
                {error}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="admin-message">
                No matching bookings found.
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Address</th>
                      <th>Booking Date</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.map((booking) => {
                      const status = booking.status || "Pending";

                      return (
                        <tr key={booking._id}>
                          <td>
                            <div className="admin-customer">
                              <div className="customer-avatar">
                                {(booking.customerName || "C")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <strong>
                                {booking.customerName}
                              </strong>
                            </div>
                          </td>

                          <td>{booking.service}</td>

                          <td className="admin-address">
                            {booking.address}
                          </td>

                          <td>
                            {new Date(
                              booking.bookingDate
                            ).toLocaleDateString()}
                          </td>

                          <td>
                            <span
                              className={`status-badge ${status.toLowerCase()}`}
                            >
                              {status}
                            </span>
                          </td>

                          <td>
                            <select
                              className="admin-status-select"
                              value={status}
                              disabled={updatingId === booking._id}
                              onChange={(e) =>
                                updateBookingStatus(
                                  booking._id,
                                  e.target.value
                                )
                              }
                            >
                              <option value="Pending">
                                Pending
                              </option>
                              <option value="Accepted">
                                Accepted
                              </option>
                              <option value="Rejected">
                                Rejected
                              </option>
                              <option value="Completed">
                                Completed
                              </option>
                            </select>

                            {updatingId === booking._id && (
                              <small className="admin-updating">
                                Saving...
                              </small>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </section>
        </section>

        <footer className="admin-footer">
          © 2026 ServiceSpot. All rights reserved.
        </footer>

      </main>
    </div>
  );
}

export default Admin;


