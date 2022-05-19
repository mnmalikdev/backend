const express = require("express");
const multer = require("multer");
const workoutbuilder = require("../controllers/workoutbuilderController");
const authController = require("./../controllers/authController");

const router = express.Router();
console.clear();
// const upload = multer({ dest: "/" });
router.route("/addWorkout").post(authController.protect, workoutbuilder.addWorkout);
router.route("/generateWorkout").post(workoutbuilder.generateWorkout);

//172.17.240.1
module.exports = router;
