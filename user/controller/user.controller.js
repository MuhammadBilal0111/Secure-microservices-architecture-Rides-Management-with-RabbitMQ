const User = require("../model/user.model");
const BlacklisttokenModel = require("../model/blacklist-token.model");
const CustomErrors = require("../utils/customErrors");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const { subscribeToQueue } = require("../services/rabbitMQ");
const EventEmitter = require("events");
const rideEventEmitter = new EventEmitter();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};
const createSendResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  const options = {
    maxAge: process.env.LOGIN_EXPIRES,
    /*
    httpOnly: true
    Purpose:

    This flag tells the browser that the cookie cannot be accessed or modified using JavaScript (e.g., via document.cookie).

    It protects the cookie from cross-site scripting (XSS) attacks — malicious scripts won't be able to steal your token.*/
    sameSite: "strict", // ✅ cookie not sent from other websites
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true; // only send cookie over HTTPS in production
  }

  res.cookie("jwt", token, options);
  delete user._doc.password;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
// register request handler
exports.register = asyncErrorHandler(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  const user = await User.create({ firstname, lastname, email, password });
  createSendResponse(user, 201, res);
});

// login request handler
exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("email", email, "password", password);
  if (!email || !password) {
    const error = new CustomErrors(
      "Please provide email address and password for login in!",
      400
    );
    return next(error);
  }
  // check if user exist and password matches
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new CustomErrors("User not found, Please register!", 404);
    return next(error);
  }
  if (!(await user.comparePasswordInDb(password, user.password))) {
    const error = new CustomErrors("Incorrect email or password", 401);
    return next(error);
  }

  createSendResponse(user, 200, res);
});

exports.logout = asyncErrorHandler(async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }
    token = token || req.cookies.jwt;
    await BlacklisttokenModel.create({ token }); // JWT tokens are stateless by default — once issued, they're valid until they expire (you can't revoke them easily). So even if a user logs out, the token may still be valid.
    res.clearCookie("jwt");
    res.status(200).json({
      status: "success",
      message: "User logged out successfully!",
    });
  } catch (error) {
    console.log(error);
    return next(new CustomErrors("Logout failed. Please try again.", 500));
  }
});
exports.profile = asyncErrorHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.acceptedRide = asyncErrorHandler(async (req, res) => {
  // Long polling: wait for 'ride-accepted' event
  rideEventEmitter.once("ride-accepted", (data) => {
    return res.status(201).send(data);
  });

  // Set timeout for long polling (e.g., 30 seconds)
  setTimeout(() => {
    res.status(204).send();
  }, 30000);
});

subscribeToQueue("ride-accepted", async (msg) => {
  // listen to ride-accepted queue
  const data = JSON.parse(msg);
  rideEventEmitter.emit("ride-accepted", data); // emit ride-accepted
});
