const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    last_name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },
    phone_no: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },
    roles: {
      type: Boolean,
      required: true,
    },
    joined_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
