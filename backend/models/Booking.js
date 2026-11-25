
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: [3, "Name must contain at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must contain at least 5 characters"],
      maxlength: [200, "Address cannot exceed 200 characters"]
    },

    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true
    },

    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"]
    },

    requirements: {
      type: String,
      trim: true,
      maxlength: [500, "Requirements cannot exceed 500 characters"],
      default: ""
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
