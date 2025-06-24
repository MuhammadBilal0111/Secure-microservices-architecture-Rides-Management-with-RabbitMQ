const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  captain: {
    type: mongoose.Types.ObjectId,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  pickup: {
    // location
    type: String,
    required: true,
  },
  destination: {
    // location
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "started", "completed"],
    default: "requested",
  },
});

const ridenModel = mongoose.model("Ride", rideSchema);
module.exports = ridenModel;
