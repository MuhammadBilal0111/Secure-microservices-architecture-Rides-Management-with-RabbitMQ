const CustomErrors = require("../utils/customErrors");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const {
  getUserProfile,
  getCaptainProfile,
} = require("../services/axios.service");

exports.userAuth = asyncErrorHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  token = token || req.cookies.jwt;
  if (!token) {
    return next(new CustomErrors("You are not logged in", 401)); // 401 unotherize
  }
  console.log("token", token);
  const response = await getUserProfile(token); // fetch data user service of the user profile

  const user = response.data;
  if (!user) {
    return next(new CustomErrors("Unauthorize user"), 403);
  }
  req.user = user;
  next();
});
exports.captainAuth = asyncErrorHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  token = token || req.cookies.jwt;
  if (!token) {
    return next(new CustomErrors("You are not logged in", 401)); // 401 unotherize
  }
  console.log("token", token);
  const response = await getCaptainProfile(token); // fetch data user service of the user profile
  console.log(response);
  const captain = response.data;
  if (!captain) {
    return next(new CustomErrors("Unauthorize captain"), 403);
  }
  req.captain = captain;
  next();
});
