const Booking = require("./models/Booking");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to ServiceSpot Backend!");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ServiceSpot backend is running!"
  });
});


app.post("/api/bookings", async (req, res) => {
  console.log("Booking route reached!");
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking saved successfully!",
      booking: savedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save booking",
      error: error.message
    });
  }
});



app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
});



app.patch("/api/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Accepted",
      "Rejected",
      "Completed"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status"
      });
    }

  const booking = await Booking.findByIdAndUpdate(
  req.params.id,
  { status },
  { returnDocument: "after", runValidators: true }
);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      message: "Booking status updated successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message
    });
  }
});


// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
