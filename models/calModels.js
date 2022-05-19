const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const MealSchema = new mongoose.Schema({
  MealType: {
    type: String,
    Required: true,
    Default: "Breakfast",
  },
  FoodName: {
    type: String,
    Required: true,
  },
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
    type:Date
  }
});
const Meal = mongoose.model("Meal", MealSchema);

module.exports = Meal;
