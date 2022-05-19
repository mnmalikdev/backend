const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const workoutbuilderSchema = new mongoose.Schema({
  WorkoutType: [
    {
      WorkoutType: {
        UserId: String,
        Type: {
          type: String,
          enum: ["powerlifting", "bodybuilding", "bodyweight", "crossfit"],
          Default: "bodybuilding",
        },
        workoutName: String,
        targetMuscle: String,
        Date: {
          type: Date,
          required: [true, "Please provide a date"],
        },
        intensity: {
          type: String,
          enum: ["mild", "moderate", "intense"],
          Default: "mild",
        },
      },
    },
  ],
  Exercise: [
    {
      name: {
        type: String,
        required: [true, "Please provide name"],
      },
      Sets: {
        type: Number,
        required: [true, "Please provide Sets"],
      },
      Reps: {
        type: Number,
        required: [true, "Please provide Reps"],
      },
      RPE: {
        type: Number,
        required: [true, "Please provide RPE"],
      },
    },
  ],
});

const workoutbuilder = mongoose.model("workoutbuilder", workoutbuilderSchema);

module.exports = workoutbuilder;
