const express = require("express");
const multer = require("multer");
const mealController = require("./../controllers/mealController");
const authController = require("./../controllers/authController");
const router = express.Router();
router.route("/addMeal")
    .post(authController.protect,mealController.addMeal)
router.route("/getMeal")
    .post(authController.protect,mealController.getMeal)
router.route("/delete")
    .post(authController.protect,mealController.delete)
router.route("/getCalories")
    .post(authController.protect,mealController.getCalories)
router.route("/getTodayMeals")
    .post(authController.protect,mealController.getTodayMeals)
router.route("/lastWeekCal")
    .post(authController.protect,mealController.lastWeekCal)
    //===============================================================
router.route("/diaryhistory")
    .post(authController.protect,mealController.diaryhistory)
    // router.route("/getTodayMeals")
    // router.route("/currentWeekPercentage") 
 
    //===============================================================
module.exports = router;
 