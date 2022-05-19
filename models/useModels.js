const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },


  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  age:Number,
  Weight: {
    type: Number,
    required: [true, "Please confirm your Weight"],
    Default: '0.0',
  },

  Height: {
    type: Number,
    Default: 0.0,
  },
  Country: {
    type: String,
    // required: true,
    Default: "Pakistan",
  },
  Goal: String,
  ActivityLevel: String,
  weeklyGoal: {
    type: Number,
  },
  Gender: {
    type: String,
    Enum: ["Male", "Female"],
  },
  SubscriptionStatus: {
    type: String,
    Enum: ["premium", "trial"],
  },
  MaintenanceCalories: {
    type: Number,
  },
  BodyFat: {
    type: Number,
  },
  // Meals: [
  //   {
  //     Type: Schema.Types.ObjectId,
  //     Ref: "Meal",
  //   },
  // ],
  Recommendations: {
    type: [String],
  },
  // WorkoutSessions: [
  //   {
  //     Type: Schema.Types.ObjectId,
  //     Ref: "Workout",
  //   },
  // ],
  //============================================================================

  //============================================================================
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  // Hash the password with cost of 12
  this.password = await bcrypt.hashSync(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
 
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = Math.floor(Math.random() * 10000) + "";

  this.passwordResetToken = resetToken;

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
