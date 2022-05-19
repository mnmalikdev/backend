const mongoose = require("mongoose");

const helpAndSupport = new mongoose.Schema({
  title: {
    type: String,
    Required: true,
  },
  type: {
    type: String,
    Required: true,
  },
  details: {
    type: String,
    Required: true,
  },

  UserId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Meal must belong to a user"],
  },
  Date: {
    type: Date,
    required: [true, "Please provide a date"],
  },
});
const helpAndSupports = mongoose.model("helpAndSupport", helpAndSupport);

module.exports = helpAndSupports;
