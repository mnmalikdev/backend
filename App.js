const express = require("express");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const xss = require('xss-clean');
const helmet = require('helmet');
const cookieParser = require("cookie-parser");
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const AppError =require('./utils/AppError')
const userRoute = require('./routes/userRoutes')
const mealRoute = require('./routes/calRoutes')
const coachingRoute = require('./routes/coachingController')
const workoutbuilderRoutes= require('./routes/workoutbuilderRoutes')
// create express
const app = express();
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
console.clear();
// Prevent parameter pollution

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);
  next();
});
app.all("/",(req, res) => {
  res.send("ok")
})
app.use('/api/user', userRoute);
app.use('/api/meal', mealRoute);
app.use('/api/workoutbuilderRoutes',workoutbuilderRoutes);
app.use('/api/coachingRoute', coachingRoute);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// app.use(globalErrorHandler);

module.exports = app;