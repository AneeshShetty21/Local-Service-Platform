
import { useState } from "react";
import "./App.css";

const categories = [
  { name: "Plumbing", icon: "🔧", description: "Pipes, taps & leaks" },
  { name: "Electrical", icon: "⚡", description: "Repairs & installations" },
  { name: "Cleaning", icon: "🧹", description: "A clean, fresh home" },
  { name: "Appliance Repair", icon: "🛠️", description: "Fix everyday appliances" },
  { name: "Painting", icon: "🎨", description: "Refresh your walls" },
  { name: "Home Tutoring", icon: "📚", description: "Learn with a tutor" },
];

const providers = [
  {
    name: "Ravi Kumar",
    service: "Plumbing",
    rating: "4.9",
    price: "From ₹299",
    initials: "RK",
  },
  {
    name: "Priya Services",
    service: "Home Cleaning",
    rating: "4.8",
    price: "From ₹499",
    initials: "PS",
  },
  {
    name: "Arun Electricals",
    service: "Electrical Repair",
    rating: "4.9",
    price: "From ₹249",
    initials: "AE",
  },
];

function App() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");



  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(search.toLowerCase()) ||
      provider.service.toLowerCase().includes(search.toLowerCase());

   
const categoryServiceMap = {
  Plumbing: ["plumbing"],
  Electrical: ["electrical"],
  Cleaning: ["cleaning"],
  "Appliance Repair": ["appliance repair"],
  Painting: ["painting"],
  "Home Tutoring": ["home tutoring"],
};

const matchesCategory =
  selectedCategory === "All" ||
  (categoryServiceMap[selectedCategory] || []).some((service) =>
    provider.service.toLowerCase().includes(service)
  );


    return matchesSearch && matchesCategory;
  });

  function handleSearch(event) {
    event.preventDefault();
    setSelectedCategory("All");
  }


 


  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">S</span>
          <span>Service<span className="brand-accent">Spot</span></span>
        </a>

        <nav className="nav-links">
          <a href="#services">Services</a>
          <a href="#providers">Find providers</a>
        </nav>

        <button
          className="provider-button"
          onClick={() =>
            alert("Provider registration will be added in a future step!")
          }
        >
          Become a provider
        </button>

     

      </header>

      <main>
        <section className="hero" id="home">
          <span className="eyebrow">YOUR NEIGHBOURHOOD, MADE EASIER</span>

          <h1>
            Local help.
            <br />
            <span>Right when you need it.</span>
          </h1>

          <p className="hero-description">
            Discover trusted professionals for everyday tasks, home repairs
            and more, all in one place.
          </p>

          <form className="search-form" onSubmit={handleSearch}>
            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Try plumbing, cleaning..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <button type="submit" className="search-button">
              Search services
            </button>
          </form>

          <p className="search-note">
            Simple booking · Local professionals · Convenient service
          </p>
        </section>

        <section className="section" id="services">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT DO YOU NEED?</span>
              <h2>Explore services</h2>
              <p>Find the right person for the job.</p>
            </div>
            <span className="section-count">
              {filteredCategories.length} categories
            </span>
          </div>

          <div className="category-grid">
            {filteredCategories.map((category) => (
              <button
                className="category-card"
                key={category.name}
                onClick={() => {
                  setSearch("");
                  setSelectedCategory(category.name);
                  document
                    .getElementById("providers")
                    .scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-description">
                  {category.description}
                </span>
              </button>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <p className="empty-state">
              No categories match your search. Try another keyword.
            </p>
          )}
        </section>

        <section className="section providers-section" id="providers">
          <div className="section-heading">
            <div>
              <span className="eyebrow">MEET THE PROFESSIONALS</span>
              <h2>Featured providers</h2>
              <p>Discover professionals for your everyday needs.</p>
            </div>
            <button
              className="text-button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
            >
              Clear filters ↗
            </button>
          </div>

          {selectedCategory !== "All" && (
            <p className="filter-note">
              Showing providers for: <strong>{selectedCategory}</strong>
            </p>
          )}

          <div className="provider-grid">
            {filteredProviders.map((provider) => (
              <article className="provider-card" key={provider.name}>
                <div className="provider-top">
                  <div className="provider-avatar">{provider.initials}</div>
                  <span className="rating">★ {provider.rating}</span>
                </div>

                <h3>{provider.name}</h3>
                <p className="provider-service">{provider.service}</p>

                <div className="provider-bottom">
                  <span>{provider.price}</span>
                  <button
                    className="view-button"
                    onClick={() => setSelectedProvider(provider)}
                  >
                    View
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <p className="empty-state">
              No providers found. Try another search or clear your filters.
            </p>
          )}

         
  {selectedProvider && (
    <div className="provider-details">
     <h2>Provider Details</h2>

     <h3>{selectedProvider.name}</h3>
     <p>Service: {selectedProvider.service}</p>
     <p>Rating: ★ {selectedProvider.rating}</p>

     
     <p>{selectedProvider.price}</p>

    <button
      className="search-button"
      onClick={() => setShowBooking(true)}
    >
      Book Service
  </button>

  <button
    className="view-button"
   onClick={() => setSelectedProvider(null)}
  >
   Back to providers
 </button>


    </div>
   )}

   
{showBooking && selectedProvider && (
  <div className="provider-details">
    <h2>Book a Service</h2>

    <p>
      Provider: <strong>{selectedProvider.name}</strong>
    </p>
    <p>Service: {selectedProvider.service}</p>

    

   
<form
  onSubmit={async (event) => {
    event.preventDefault();
    setBookingLoading(true);
    setBookingError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const bookingData = {
      customerName: formData.get("customerName"),
      address: formData.get("address"),
      service: selectedProvider.service,
      bookingDate: formData.get("date"),
      requirements: formData.get("requirements"),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Booking failed.");
      }

      alert("Booking saved successfully!");
      form.reset();
      setShowBooking(false);
    } catch (error) {
      setBookingError(
        error.message || "Could not connect to the backend."
      );
    } finally {
      setBookingLoading(false);
    }
  }}
>
  <label>
    Your name
    <input
      type="text"
      name="customerName"
      placeholder="Enter your full name"
      required
    />
  </label>

  <label>
    Service address
    <input
      type="text"
      name="address"
      placeholder="Enter your address"
      required
    />
  </label>

  <label>
    Preferred date
    <input
      type="date"
      name="date"
      min={new Date().toLocaleDateString("en-CA")}
      required
    />
  </label>

  <label>
    Additional requirements
    <textarea
      name="requirements"
      placeholder="Describe what you need (optional)"
      rows="3"
    />
  </label>

  {bookingError && (
    <p role="alert" style={{ color: "red" }}>
      {bookingError}
    </p>
  )}

  <button
    type="submit"
    className="search-button"
    disabled={bookingLoading}
  >
    {bookingLoading ? "Submitting..." : "Submit Booking"}
  </button>

  <button
    type="button"
    className="view-button"
    onClick={() => {
      setShowBooking(false);
      setBookingError("");
    }}
  >
    Cancel
  </button>
</form>

  </div>
)}


        </section>




      </main>

      <footer className="footer">
        <a className="brand" href="#home">
          <span className="brand-icon">S</span>
          <span>Service<span className="brand-accent">Spot</span></span>
        </a>
        <p>Making local services easier to find.</p>
        <span>© 2026 ServiceSpot · Project prototype</span>
      </footer>
    </div>
  );
}

export default App;

