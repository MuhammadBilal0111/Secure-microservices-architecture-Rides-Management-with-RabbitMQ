const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const express = require("express");
const morgan = require("morgan");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controller/error.controller");
const RabbitMQ = require("./services/rabbitMQ");
const helmet = require("helmet");

const app = express();
app.use(helmet());

// rabbitMq connection
RabbitMQ.connect();

app.use(express.json({ limit: "10kb" })); // prevent denial of service
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(cookieParser());

// middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/", userRoutes);

app.use(globalErrorHandler); // global error handling middleware
module.exports = app;
