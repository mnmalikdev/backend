const mongoose = require("mongoose");

const scModelsSchema = new mongoose.Schema({
  Calories: {
    type: Number,
    Required: true,
    Default: 0,
  },
  Protein: {
    type: Number,
    Required: true,
    Default: 0,
  },
  Carbs: {
    type: Number,
    Required: true,
    Default: 0,
  },
  Fats: {
    type: Number,
    Required: true,
    Default: 0,
  },
  UserId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Meal must belong to a user"],
  },
  Date:{
    type:Date,
    required: [true, "Please provide a date"],
  },
  weight: {
    type: Number,
  }
});
const Meal = mongoose.model("scModels", scModelsSchema);

module.exports = Meal;
