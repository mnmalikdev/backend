const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/useModels");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const assessMetabolism = require("../utils/assessMetabolism");
const bodyfatprediction = require("./../BodyfatPrediction/controller/predictionController");
const bcrypt = require("bcrypt");
const scModels = require("./../models/scModels");
const helpAndSupport = require("../models/helpAndSupport");
const { promisify } = require("util");
const dailyWeight = require("./../models/dailyWeight");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    id: user._id,
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const maintenenceCalories = assessMetabolism(
    req.body.BodyFat,
    req.body.Weight,
    req.body.Gender,
    req.body.ActivityLevel,
    req.body.age
  );
  const newUser = await User.create({
    name: req.body.name,
    age: req.body.age,
    MaintenanceCalories: maintenenceCalories,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    Weight: req.body.Weight,
    Height: parseFloat(req.body.Height),
    Gender: req.body.Gender,
    Goal: req.body.Goal,
    ActivityLevel: req.body.ActivityLevel,
    BodyFat: req.body.BodyFat,
    TargetWeight: req.body.TargetWeight,
    weeklyGoal: req.body.weeklyGoal,
  });
  try {
    await sendEmail({
      email: newUser.email,
      subject: "Accounts Create",
      message: "thanks for creating new accounts",
    });
  } catch (err) {
    console.log("Error=" + err);
  }
  var today = new Date();
  let newtoday = today.getTime() % 86400000;
  newttoday = today.getTime() - newtoday;
  const newRecord = await dailyWeight.create({
    weight: req.body.weight,
    bodyFatPercentage: req.body.bodyFatPercentage,
    UserId: req.user.id,
    Date: newttoday,
  });
  createSendToken(newUser, 201, res);
});
exports.signin = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  // console.log(user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 201, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  // const resetToken = user.createPasswordResetToken();
  const resetToken = Math.floor(Math.random() * 10000) + "";

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  const r = await User.updateOne(
    { email: req.body.email },
    {
      passwordResetToken: resetToken,
      passwordResetExpires: Date.now() + 10 * 60 * 1000,
    }
  );

  // 3) Send it to user's email

  const message = `Forgot your password? use this token : ${resetToken}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    const temp = await sendEmail({
      email: req.body.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    console.log(temp);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

//===================================================================================================
// exports.forgotPassword = catchAsync(async (req, res, next) => {
//       try {
//     const temp=await sendEmail({
//       email: req.body.email,
//       subject: "Your password reset token (valid for 10 min)",
//       message:"hello this is your password reset token",
//     });
//     console.log(temp);
//     res.status(200).json({
//       status: "success",
//       message: "Token sent to email!",
//     });
//   } catch (err) {
//     // user.passwordResetToken = undefined;
//     // user.passwordResetExpires = undefined;
//     // await user.save({ validateBeforeSave: false });
//     console.log(err);
//     return next(
//       new AppError("There was an error sending the email. Try again later!"),
//       500
//     );
//   }
// });
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const token = parseInt(req.body.token);

  const user = await User.findOne({
    email: req.body.email,
    passwordResetToken: token,
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  const pass = await bcrypt.hashSync(req.body.password, 12);
  console.log(pass);
  await User.updateOne(
    { passwordResetToken: token },
    {
      password: pass,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    }
  );

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  // createSendToken(user, 200, res);
  // res.send()
  createSendToken(user, 201, res);
});
exports.predictBodyFat = catchAsync(async (req, res, next) => {
  const waist = req.body.waist;
  console.log(waist);
  const bfPercentage = bodyfatprediction(waist);
  res.send(200, bfPercentage);
});
exports.details = catchAsync(async (req, res, next) => {
  let token;
  if (req.body.token) {
    token = req.body.token;
  }
  if (!token) {
    return next(new AppError("Token is not working please login again", 401));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  res.send(200, currentUser);
});

exports.helpAndSupport = catchAsync(async (req, res, next) => {
  console.log(req.user.id);
  const title = req.body.title;
  const type = req.body.type;
  const details = req.body.details;
  const date = new Date().getTime();

  const newHAS = await helpAndSupport.create({
    title,
    type,
    details,
    UserId: req.user.id,
    Date: date,
  });
  try {
    await sendEmail({
      email: newUser.email,
      subject: "Thanks for contact us",
      message:
        "Your message has been received. We will send you response withen 4 to 7 days ",
    });
  } catch (err) {
    console.log("Error=" + err);
  }

  res.send(200, newHAS);
});
//a function that takes in a number of factors and assesses users maintenence calories
