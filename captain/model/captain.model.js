const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const captainSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is a required field"],
    },
    lastname: {
      type: String,
      required: [true, "Lastname is a required field"],
    },
    email: {
      type: String,
      unique: true,
      lowerCase: true, // tuen the email into lowercase
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is a required field"],
      select: false,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);
captainSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
captainSchema.methods.comparePasswordInDb = async function (pswd, pswdDb) {
  return await bcrypt.compare(pswd, pswdDb);
};
const captainModel = mongoose.model("Captain", captainSchema);
module.exports = captainModel;
