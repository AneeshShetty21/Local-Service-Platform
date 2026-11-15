const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    service: {
      type: String,
      required: true
    },
    bookingDate: {
      type: Date,
      required: true
    },
    requirements: {
      type: String,
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
