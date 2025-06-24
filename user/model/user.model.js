const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePasswordInDb = async function (pswd, pswdDb) {
  return await bcrypt.compare(pswd, pswdDb);
};
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
