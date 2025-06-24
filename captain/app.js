const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const express = require("express");
const app = express();
const morgan = require("morgan");
const captainRoutes = require("./routes/captain.routes");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controller/error.controller");
const RabbitMQ = require("./services/rabbitMQ");

// RabbitMQ connection
RabbitMQ.connect();

// Middleware order matters!
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/", captainRoutes);

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
