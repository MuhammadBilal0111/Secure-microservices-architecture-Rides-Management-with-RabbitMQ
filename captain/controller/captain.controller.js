const Captain = require("../model/captain.model");
const BlacklisttokenModel = require("../model/blacklist-token.model");
const CustomErrors = require("../utils/customErrors");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const { subscribeToQueue } = require("../services/rabbitMQ");

const pendingRequests = [];

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};
const createSendResponse = (captain, statusCode, res) => {
  const token = signToken(captain._id);
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
  delete captain._doc.password;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      captain,
    },
  });
};
// register request handler
exports.register = asyncErrorHandler(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  const captain = await Captain.create({
    firstname,
    lastname,
    email,
    password,
  });
  createSendResponse(captain, 201, res);
});

// login request handler
exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new CustomErrors(
      "Please provide email address and password for login in!",
      400
    );
    return next(error);
  }
  // check if captain exist and password matches
  const captain = await Captain.findOne({ email }).select("+password");
  if (!captain) {
    const error = new CustomErrors("Captain not found, Please register!", 404);
    return next(error);
  }
  if (!(await captain.comparePasswordInDb(password, captain.password))) {
    const error = new CustomErrors("Incorrect email or password", 401);
    return next(error);
  }

  createSendResponse(captain, 200, res);
});

exports.logout = asyncErrorHandler(async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }
    token = token || req.cookies.jwt;
    await BlacklisttokenModel.create({ token }); // JWT tokens are stateless by default — once issued, they're valid until they expire (you can't revoke them easily). So even if a captain logs out, the token may still be valid.
    res.clearCookie("jwt");
    res.status(200).json({
      status: "success",
      message: "Captain logged out successfully!",
    });
  } catch (error) {
    console.log(error);
    return next(new CustomErrors("Logout failed. Please try again.", 500));
  }
});
exports.profile = asyncErrorHandler(async (req, res) => {
  const captain = req.captain;
  res.status(200).json({
    status: "success",
    data: captain,
  });
});
exports.toggleAvailability = asyncErrorHandler(async (req, res) => {
  const captain = await Captain.findById(req.captain._id);

  if (!captain) {
    return res.status(404).json({
      status: "fail",
      message: "Captain not found",
    });
  }

  captain.isAvailable = !captain.isAvailable;
  await captain.save();

  res.status(201).json({
    status: "success",
    captain,
  });
});

module.exports.waitForNewRide = asyncErrorHandler(async (req, res) => {
  // Set timeout for long polling (e.g., 30 seconds)
  req.setTimeout(30000, () => {
    res.status(204).end(); // No Content
  });

  // Add the response object to the pendingRequests array
  pendingRequests.push(res);
});

subscribeToQueue("new-ride", (data) => {
  const rideData = JSON.parse(data);
  console.log(rideData);
  // Send the new ride data to all pending requests
  pendingRequests.forEach((res) => {
    res.json(rideData);
  });

  // Clear the pending requests
  pendingRequests.length = 0;
});
