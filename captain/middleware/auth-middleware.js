const jwt = require("jsonwebtoken");
const Captain = require("../model/captain.model");
const blacklisttokenModel = require("../model/blacklist-token.model");
const CustomErrors = require("../utils/customErrors");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const util = require("util");

module.exports = asyncErrorHandler(async (req, res, next) => {
  // 1. Read the token and check if it exist
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  token = token || req.cookies.jwt;
  if (!token) {
    return next(new CustomErrors("You are not logged in", 401)); // 401 unautherize
  }

  // 2. validate that the token must not be blacklist
  const isBlackListed = await blacklisttokenModel.find({ token });
  if (isBlackListed.length) {
    return next(new CustomErrors("Unauthorized", 401));
  }

  // 3. validate the token(checking expired jwt, tempered jwt,  etc)
  // jwt.verify(token, process.env.SECRET_STR); asynchronous function but doesnot return a promise
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );
  // jwt.verify() generate error in jwt expired etc that is handled by global error handler

  // 4. if captain exist in db
  const captain = await Captain.findById(decodedToken.id);
  if (!captain) {
    const error = new CustomErrors(
      "The captain with given token doesnot exist",
      401
    );
    next(error);
  }
  req.captain = captain;
  next();
});
