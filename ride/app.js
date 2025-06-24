const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rideRoutes = require("./routes/ride.routes");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controller/error.controller");
const RabbitMQ = require("./services/rabbitMQ");

const app = express();
app.use(helmet());

// rabbitMq connection
RabbitMQ.connect();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/", rideRoutes);

app.use(globalErrorHandler); // global error handling middleware
module.exports = app;
