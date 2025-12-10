const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    // username and password are defined automatically by passport local mongoose
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {      // hashed password
        type: String,
        required: true
    },
    email: {
        type : String,
        required : true
    }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


module.exports = mongoose.model("User", userSchema);