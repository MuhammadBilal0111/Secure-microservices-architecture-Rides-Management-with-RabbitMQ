const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 86400, // expires after 1 day
    },
  },
  {
    timestamps: true,
  }
);
const BlacklistModel = mongoose.model("BlacklistModel", blacklistSchema);
module.exports = BlacklistModel;
