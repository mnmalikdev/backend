const mongoose = require("mongoose");

const dailyWeight = new mongoose.Schema({
  weight: {
    type: Number,
    Required: true,
  },
  bodyFatPercentage: {
    type: Number,
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
const dailyWeights = mongoose.model("dailyWeight", dailyWeight);

module.exports = dailyWeights;
