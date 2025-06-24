const express = require("express");
const router = express.Router();
const authMiddleware = require("./../middleware/auth.middleware");
const rideController = require("./../controller/ride.controller");

router
  .route("/create-ride")
  .post(authMiddleware.userAuth, rideController.createRide);
router
  .route("/accept-ride")
  .put(authMiddleware.captainAuth, rideController.acceptRide);
module.exports = router;
