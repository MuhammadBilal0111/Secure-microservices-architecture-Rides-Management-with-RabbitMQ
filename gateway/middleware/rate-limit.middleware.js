const rateLimit = require("express-rate-limit");

// Login Rate Limiter
// Protects against brute-force login attempts and helps mitigate Denial of Service (DoS) attacks
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Max 5 login attempts per IP
  message: "Too many login attempts. Try again later.",
});

// Register Rate Limiter
// Prevents spam/fake account registrations and limits DoS attack vectors on public endpoints
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Max 3 registration attempts per IP
  message: "Too many registration attempts. Please try again later.",
});

module.exports = {
  loginLimiter,
  registerLimiter,
};
