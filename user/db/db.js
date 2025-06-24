const mongoose = require("mongoose");

function connectDb() {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("User service successfully connected to mongoDb");
    })
    .catch((err) => {
      console.log("Error in connecting to mongoDb", err);
    });
}
module.exports = connectDb;
