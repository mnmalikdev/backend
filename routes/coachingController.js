const express = require("express");
const multer = require("multer");
const coachingController = require("./../controllers/coachingController");
const authController = require("./../controllers/authController");
const router = express.Router();
router.route("/initialCoaching")
    .post(authController.protect,coachingController.initialCoaching)
router.route("/weeklyCheckIn")
    .post(authController.protect,coachingController.weeklyCheckIn)
router.route("/previousWeek")
    .post(authController.protect,coachingController.previousWeek)
router.route("/currentWeek")
    .post(authController.protect,coachingController.currentWeek)
router.route("/currentWeekPercentage")
    .post(authController.protect,coachingController.currentWeekPercentage)
router.route("/addDailyWeight")
    .post(authController.protect,coachingController.addDailyWeight)  
router.route("/getDailyWeight")
    .post(authController.protect,coachingController.getDailyWeight)
router.route("/weeklyCheckInHistory")
    .post(authController.protect,coachingController.weeklyCheckInHistory)
    module.exports = router;
   