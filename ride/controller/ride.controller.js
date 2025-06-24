const rideModel = require("./../model/ride.model");
const CustomErrors = require("./../utils/customErrors");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");
const { publishToQueue } = require("./../services/rabbitMQ");

exports.createRide = asyncErrorHandler(async (req, res, next) => {
  const { pickup, destination } = req.body;
  const newRide = new rideModel({
    user: req.user._id,
    pickup,
    destination,
  });
  await newRide.save();
  await publishToQueue("new-ride", JSON.stringify(newRide));
  res.status(201).json({
    status: "success",
    ride: newRide,
  });
});
exports.acceptRide = asyncErrorHandler(async (req, res, next) => {
  const { rideId } = req.query;
  const ride = await rideModel.findById(rideId);
  if (!ride) {
    return new CustomErrors("Ride not found", 404);
  }
  ride.status = "accepted";
  await ride.save();
  publishToQueue("ride-accepted", JSON.stringify(ride));
  res.status(201).json({
    status: "success",
    ride,
  });
});
