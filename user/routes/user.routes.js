const express = require("express");
const router = express.Router();
const userController = require("../../user/controller/user.controller");
const authMiddleware = require("../middleware/auth-middleware");

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/logout").get(authMiddleware.userAuth, userController.logout);
router.route("/profile").get(authMiddleware.userAuth, userController.profile);
router
  .route("/accepted-ride")
  .get(authMiddleware.userAuth, userController.acceptedRide);

module.exports = router;
