const http = require("http");
const app = require("./app");
const connectDb = require("./db/db");
const server = http.createServer(app);

// connect to DB
connectDb();

// Starting server
const RIDE_SERVICE_PORT = process.env.RIDE_SERVICE_PORT;
server.listen(RIDE_SERVICE_PORT, () => {
  console.log("Ride service is running on http://localhost:3003");
});
