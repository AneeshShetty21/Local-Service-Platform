
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const Booking = require("./models/Booking");
const Admin = require("./models/Admin");
const verifyAdmin = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to ServiceSpot Backend!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ServiceSpot backend is running!"
  });
});

// Create Booking - Public
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      customerName,
      address,
      service,
      bookingDate,
      requirements
    } = req.body || {};

    // Required field validation
    if (
      !customerName ||
      !address ||
      !service ||
      !bookingDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required booking details"
      });
    }

    // Data type validation
    if (
      typeof customerName !== "string" ||
      typeof address !== "string" ||
      typeof service !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking details"
      });
    }

    // Remove unnecessary spaces
    const cleanName = customerName.trim();
    const cleanAddress = address.trim();
    const cleanService = service.trim();

    if (!cleanName || !cleanAddress || !cleanService) {
      return res.status(400).json({
        success: false,
        message: "Booking details cannot be empty"
      });
    }

    // Requirements validation
    if (
      requirements !== undefined &&
      typeof requirements !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid requirements"
      });
    }

    // Date validation
    const parsedDate = new Date(bookingDate);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date"
      });
    }

    // Create booking
    const booking = new Booking({
      customerName: cleanName,
      address: cleanAddress,
      service: cleanService,
      bookingDate: parsedDate,
      requirements: requirements?.trim() || ""
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking saved successfully!",
      booking: savedBooking
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    console.error("Booking creation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to save booking"
    });
  }
});

// Get All Bookings - Admin Only
app.get("/api/bookings", verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1
    });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error("Fetch bookings error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
});

// Update Booking Status - Admin Only
app.patch(
  "/api/bookings/:id/status",
  verifyAdmin,
  async (req, res) => {
    try {
      const { status } = req.body || {};

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

      // MongoDB ID validation
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID"
        });
      }

      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          returnDocument: "after",
          runValidators: true
        }
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
      console.error("Update booking error:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to update booking status"
      });
    }
  }
);

// Admin Login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase()
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (error) {
    console.error("Admin login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Admin login failed"
    });
  }
});

// Handle invalid JSON and other middleware errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body"
    });
  }

  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
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
