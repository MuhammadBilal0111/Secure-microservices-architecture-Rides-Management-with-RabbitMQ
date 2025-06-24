const CustomErrors = require("../utils/customErrors");

const devErrors = (res, err) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    stackTrace: err.stack,
    error: err,
  });
};
const duplicateErrorHandler = (err) => {
  const email = err.keyValue.email;
  const msg = `There is already a email with email ${email}. Please use another email`;
  return new CustomErrors(msg, 400);
};
const castErrorHandler = (err) => {
  const msg = `Invalid value for ${err.path} : ${err.value}`;
  return new CustomErrors(msg, 400);
};
const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data : ${errorMessages}`;
  return new CustomErrors(msg, 400);
};
const handleExpiredJWT = (err) => {
  return new CustomErrors("JWT has expire. Please login again!", 400);
};
const handleJWTError = (err) => {
  return new CustomErrors("Invalidtoken please login again!", 401);
};
const prodErrors = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong! try again later",
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    devErrors(res, err);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = castErrorHandler(err); // when you give number in string type field number
    if (err.code === 11000) err = duplicateErrorHandler(err); // when duplicate email is used
    if (err.name === "JsonWebTokenError") err = handleJWTError(err); // execute when token is fabricated
    if (err.name === "ValidationError") err = validationErrorHandler(err); // if syntax not followed then generate the validation error from validation package
    if (err.name === "TokenExpiredError") err = handleExpiredJWT(err); // when token expires
    prodErrors(res, err);
  }
};
