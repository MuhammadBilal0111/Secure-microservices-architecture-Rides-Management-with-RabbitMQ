const http = require("http");
const app = require("./app");
const connectDb = require("./db/db");
const server = http.createServer(app);

// connect to DB
connectDb();

// Starting server
const CAPTAIN_SERVICE_PORT = process.env.CAPTAIN_SERVICE_PORT;
server.listen(CAPTAIN_SERVICE_PORT, () => {
  console.log("Captain service is running on http://localhost:3002");
});
