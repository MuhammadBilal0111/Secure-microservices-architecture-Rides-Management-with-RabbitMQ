const express = require("express");
const router = express.Router();
const captainController = require("./../controller/captain.controller");
const authMiddleware = require("./../middleware/auth-middleware");

router.route("/register").post(captainController.register);
router.route("/login").post(captainController.login);
router.route("/logout").get(authMiddleware, captainController.logout);
router.route("/profile").get(authMiddleware, captainController.profile);
router
  .route("/toggle-availability")
  .patch(authMiddleware, captainController.toggleAvailability);
router.route("/new-ride").get(authMiddleware, captainController.waitForNewRide);

module.exports = router;
