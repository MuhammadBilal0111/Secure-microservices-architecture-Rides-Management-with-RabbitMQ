const express = require("express");
const expressProxy = require("express-http-proxy");
const app = express();
const {
  registerLimiter,
  loginLimiter,
} = require("./middleware/rate-limit.middleware");

// Apply rate limiter
app.use("/user/register", registerLimiter);
app.use("/user/login", loginLimiter);
app.use("/captain/register", registerLimiter);
app.use("/captain/login", loginLimiter);

// Proxy routes
app.use("/user", expressProxy("http://localhost:3001")); //  Forward all '/user' requests to the User service running on port 3001
app.use("/captain", expressProxy("http://localhost:3002")); // Forward all '/captain' requests to the Captain service running on port 3002
app.use("/ride", expressProxy("http://localhost:3003")); // Forward all '/ride' requests to the Ride service running on port 3003

const GATEWAY_SERVICE_PORT = 3000;
app.listen(GATEWAY_SERVICE_PORT, () => {
  // when request comes to "/users" of PORT 3000, it goes to PORT 3001 server
  console.log("Gateway service is running on http://localhost:3000");
});
