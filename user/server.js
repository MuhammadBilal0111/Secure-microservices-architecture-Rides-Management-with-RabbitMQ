const http = require("http");
const app = require("./app");
const connectDb = require("./db/db");
const server = http.createServer(app);

// connect to DB
connectDb();

// Starting server
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT;
server.listen(USER_SERVICE_PORT, () => {
  console.log("User service is running on http://localhost:3001");
});
