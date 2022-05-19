const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/useModels");
const scModels = require("./../models/scModels");
const calModels = require("./../models/calModels");
const dailyWeight = require("./../models/dailyWeight");
const bodyfatprediction = require("./../BodyfatPrediction/controller/predictionController");

exports.initialCoaching = catchAsync(async (req, res, next) => {
  //get user from database.
  //get Goal from user model

  const goal = req.user.Goal; // this can be anyone from ["Fat-loss", "Muscle Gain", "Maintenance"] in database.
  //get maintenence calories from user model
  const MaintenanceCalories = req.user.MaintenanceCalories;
  //get body fat percentage from user model
  const BodyFat = req.user.BodyFat;
  let suggestedCals = 0;
  let macros = {};
  if (goal == "Fat-loss" || goal == "Fat loss") {
    if (BodyFat >= 23) {
      // subtract 15 percent from maintenance calories
      suggestedCals = MaintenanceCalories - MaintenanceCalories * 0.15;
    } else {
      // subtract 10 percent from maintenance calories
      suggestedCals = MaintenanceCalories - MaintenanceCalories * 0.1;
    }
    // split suggested calories into 25% protein and 50% carbs and 25% fat
    // Carbs have 4 calories per gram
    // Proteins have 4 calories per gram
    // Fats have 9 calories per gram
    macros = {
      protein: (suggestedCals * 0.25) / 4,
      carbs: (suggestedCals * 0.5) / 4,
      fat: (suggestedCals * 0.25) / 9,
    };
  }
  if (goal == "Muscle gain") {
    suggestedCals = MaintenanceCalories + MaintenanceCalories * 0.1;
    // split suggested calories into 25% protein and 60% carbs and 15% fat
    // Carbs have 4 calories per gram
    // Proteins have 4 calories per gram
    // Fats have 9 calories per gram
    macros = {
      protein: (suggestedCals * 0.25) / 4,
      carbs: (suggestedCals * 0.6) / 4,
      fat: (suggestedCals * 0.15) / 9,
    };
  }
  if (goal == "Maintenance") {
    suggestedCals = MaintenanceCalories;
    // split macros 45 to 60% carbohydrate 20 to 35% fats and Remainder from protein
    // Carbs have 4 calories per gram
    // Proteins have 4 calories per gram
    // Fats have 9 calories per gram
    macros = {
      protein: (suggestedCals * 0.45) / 4,
      carbs: (suggestedCals * 0.6) / 4,
      fat: (suggestedCals * 0.2) / 9,
    };
  }

  // persist suggested calories and macros to database
  const user = await User.findById(req.user.id);
  // user.SuggestedCalories = suggestedCals;
  // user.macros = macros;

  const d = new Date().getTime();

  const newRecord = await scModels.create({
    Calories: suggestedCals,
    Protein: macros.protein,
    Carbs: macros.carbs,
    Fats: macros.fat,
    UserId: req.user.id,
    weight: req.user.Weight,
    Date: d,
  });

  res.send(200, newRecord);
});

exports.weeklyCheckIn = catchAsync(async (req, res, next) => {
  //get user from database.
  const user = await User.findById(req.user.id);
  //get Goal from user model
  const r = await User.updateOne(
    { id: req.user.id },
    {
      Weight: req.user.Weight,
    }
  );
  const goal = "Maintenance"; // this can be anyone from ["Fat-loss", "Muscle Gain", "Maintenance"] in database.
  // get users current weight in kgs from user model
  let weight = req.user.Weight;
  let currentWeight = req.body.currentWeight;
  //get suggested cals from user model
  //=======================================================
  const ddd = new Date().getTime() - 604800000;
  const check = await scModels.findOne({
    $and: [{ UserId: req.user.id }, { Date: { $gte: ddd } }],
  });

  let suggestedCals = check.Calories;
  //get maintenance calories from user model
  let maintenanceCalories = req.user.MaintenanceCalories;
  //get macros from user model
  let macros = {};
  // fetch weekly goal in kgs from user model
  const weeklyGoal = req.user.weeklyGoal;
  if (goal === "Fat-loss") {
    let estimatedWeight = weight - weeklyGoal;
    if (currentWeight > estimatedWeight) {
      //subtract 100 calories from suggested calories
      suggestedCals = suggestedCals - 100;
      macros = {
        protein: (suggestedCals * 0.25) / 4,
        carbs: (suggestedCals * 0.5) / 4,
        fat: (suggestedCals * 0.25) / 9,
      };
      //update weight
      weight = currentWeight;
      //update maintenance calories
      maintenanceCalories = suggestedCals;
      // updated suggested cals and macros
      suggestedCals = suggestedCals;
      macros = macros;
      //persist data to database
    } else {
      // if current weight is less than estimated weight or eqyal to estimated weight
      // just update users weight
      weight = currentWeight;
      //persist data to database
    }
  } else if (goal === "Muscle Gain") {
    let estimatedWeight = weight + weeklyGoal;
    if (currentWeight < estimatedWeight) {
      //add 100 calories to suggested calories
      suggestedCals = suggestedCals + 100;
      macros = {
        protein: (suggestedCals * 0.25) / 4,
        carbs: (suggestedCals * 0.6) / 4,
        fat: (suggestedCals * 0.15) / 9,
      };
      //update weight
      weight = currentWeight;
      //update maintenance calories
      maintenanceCalories = suggestedCals;
      // updated suggested cals and macros
      suggestedCals = suggestedCals;
      macros = macros;
      //persist data to database
    } else {
      // if current weight is greater than estimated weight or eqyal to estimated weight
      // just update users weight
      weight = currentWeight;
      //persist data to database
    }
  } else if (goal === "Maintenance") {
    let estimatedWeight = weight + weight * 0.2;
    if (currentWeight < estimatedWeight) {
      //add 100 calories to suggested calories

      suggestedCals = suggestedCals + 100;
      macros = {
        protein: (suggestedCals * 0.45) / 4,
        carbs: (suggestedCals * 0.6) / 4,
        fat: (suggestedCals * 0.2) / 9,
      };
      //update weight
      weight = currentWeight;

      // updated suggested cals and macros
      suggestedCals = suggestedCals;
      macros = macros;
      //persist data to database
    }
    if (currentWeight > estimatedWeight) {
      suggestedCals = suggestedCals - 100;
      macros = {
        protein: (suggestedCals * 0.45) / 4,
        carbs: (suggestedCals * 0.6) / 4,
        fat: (suggestedCals * 0.2) / 9,
      };
    }
  } else {
    let estimatedWeight = weight + weight * 0.2;
    if (currentWeight < estimatedWeight) {
      //add 100 calories to suggested calories

      suggestedCals = suggestedCals + 100;
      macros = {
        protein: (suggestedCals * 0.45) / 4,
        carbs: (suggestedCals * 0.6) / 4,
        fat: (suggestedCals * 0.2) / 9,
      };
      //update weight
      weight = currentWeight;

      // updated suggested cals and macros
      suggestedCals = suggestedCals;
      macros = macros;
      //persist data to database
    }
    if (currentWeight > estimatedWeight) {
      suggestedCals = suggestedCals - 100;
      macros = {
        protein: (suggestedCals * 0.45) / 4,
        carbs: (suggestedCals * 0.6) / 4,
        fat: (suggestedCals * 0.2) / 9,
      };
    }
  }

  const d = new Date();

  let test1 = macros.protein;
  let test2 = macros.carbs;
  let test3 = macros.fat;
  const newRecord = await scModels.create({
    Calories: suggestedCals,
    Protein: test1,
    Carbs: test2,
    Fats: test3,
    UserId: req.user.id,
    weight: weight,
    Date: d,
  });

  res.send(newRecord);
});
exports.previousWeek = catchAsync(async (req, res, next) => {
  const ddd = new Date().getTime() - 604800000;
  const ddd2 = new Date().getTime() - 1209600000;
  const check = await scModels.findOne({
    $and: [
      { UserId: req.user.id },
      { Date: { $gte: ddd2 } },
      { Date: { $lte: ddd } },
    ],
  });

  res.send(200, check);
});
exports.currentWeekPercentage = catchAsync(async (req, res, next) => {
  //====================================================================================
  var today = new Date();
  let newtoday = today.getTime() % 86400000;
  newttoday = today.getTime() - newtoday;

  //====================================================================================
  let BreakfastCalories = 0;
  let BreakfastProtein = 0;
  let BreakfastCarbs = 0;
  let BreakfastFats = 0;
  //====================================================================================
  let lunchCalories = 0;
  let lunchProtein = 0;
  let lunchCarbs = 0;
  let lunchFats = 0;
  //====================================================================================
  let DinnerCalories = 0;
  let DinnerProtein = 0;
  let DinnerCarbs = 0;
  let DinnerFats = 0;
  //====================================================================================

  const Brakfast = await calModels.find({
    $and: [
      { UserId: req.user.id },
      { MealType: "Brakfast" },
      { Date: { $gte: newttoday } },
    ],
  });
  const lunch = await calModels.find({
    $and: [
      { UserId: req.user.id },
      { MealType: "lunch" },
      { Date: { $gte: newttoday } },
    ],
  });
  const Dinner = await calModels.find({
    $and: [
      { UserId: req.user.id },
      { MealType: "Dinner" },
      { Date: { $gte: newttoday } },
    ],
  });

  Brakfast.forEach((es) => {
    BreakfastCalories = BreakfastCalories + es.Calories;
    BreakfastProtein = BreakfastProtein + es.Protein;
    BreakfastCarbs = BreakfastCarbs + es.Carbs;
    BreakfastFats = BreakfastFats + es.Fats;
  });
  lunch.forEach((es) => {
    lunchCalories = lunchCalories + es.Calories;
    lunchProtein = lunchProtein + es.Protein;
    lunchCarbs = lunchCarbs + es.Carbs;
    lunchFats = lunchFats + es.Fats;
  });
  Dinner.forEach((es) => {
    DinnerCalories = DinnerCalories + es.Calories;
    DinnerProtein = DinnerProtein + es.Protein;
    DinnerCarbs = DinnerCarbs + es.Carbs;
    DinnerFats = DinnerFats + es.Fats;
  });

  //======================================================================================
  const ddd = new Date().getTime() - 604800000;
  // Date: { $gte: ddd }
  const check = await scModels.findOne({
    $and: [{ UserId: req.user.id }, { Date: { $gte: ddd } }],
   });
  // let Calories =0;
  // let Protein =0;
  // let Carbs =0;
  // let Fats =0;

  let Calories =
      (BreakfastCalories + lunchCalories + DinnerCalories) / check.Calories > 1
          ? 1
          : (BreakfastCalories + lunchCalories + DinnerCalories) / check.Calories;
  let Protein =
      (BreakfastProtein + lunchProtein + DinnerProtein) / check.Protein > 1
          ? 1
          : (BreakfastProtein + lunchProtein + DinnerProtein) / check.Protein;
  let Carbs =
      (BreakfastCarbs + lunchCarbs + DinnerCarbs) / check.Carbs > 1
          ? 1
          : (BreakfastCarbs + lunchCarbs + DinnerCarbs) / check.Carbs;
  let Fats =
      (BreakfastFats + lunchFats + DinnerFats) / check.Fats > 1
          ? 1
          : (BreakfastFats + lunchFats + DinnerFats) / check.Fats;

  // ==============================================================

  // let Calories= (BreakfastCalories + lunchCalories + DinnerCalories)/check.Calories
  //  let Protein= (BreakfastProtein + lunchProtein + DinnerProtein)/check.Protein
  //  let Carbs= (BreakfastCarbs + lunchCarbs + DinnerCarbs)/check.Carbs
  //  let Fats= (BreakfastFats + lunchFats + DinnerFats)/check.Fats

  // let Calories =0;
  // let Protein =0;
  // let Carbs =0;
  // let Fats =0;
  const reasult = [
    {
      Calories: Calories ,
      Protein: Protein,
      Carbs: Carbs,
      Fats: Fats,
    },
  ];
  res.send(200, reasult);
});
exports.currentWeek = catchAsync(async (req, res, next) => {
  const ddd = new Date().getTime() - 604800000;
  const check = await scModels.findOne({
    $and: [{ UserId: req.user.id }, { Date: { $gte: ddd } }],
  });
  console.log(check);
  res.send(200, check);
});
exports.addDailyWeight = catchAsync(async (req, res, next) => {
  var today = new Date();
  let newtoday = today.getTime() % 86400000;
  newttoday = today.getTime() - newtoday;
 
  const bfPercentage = bodyfatprediction(78);

  // const bfPercentage = bodyfatprediction(req.body.bodyFatPercentage);
  const newRecord = await dailyWeight.create({
    weight: req.body.weight,
    bodyFatPercentage: bfPercentage,
    UserId: req.user.id,
    Date: newttoday,
  });

  res.send(200, {
    status: "success",
    result: newRecord,
  });
});
exports.getDailyWeight = catchAsync(async (req, res, next) => {
  const response = await dailyWeight.find({ UserId: req.user.id });
  // var bodyFatPercentage = Array(response.length);
  // var Date = Array(response.length);
  // var weight = Array(response.length);
  // var _id=Array(response.length);
  var resp=Array(response.length);
  for (var i = 0; i < response.length; i++) {
    console.log(response[i].Date.toUTCString(3))
    resp[i]={
      "weight":response[i].weight,
      "Date":response[i].Date.toUTCString(),
      "bodyFatPercentage":response[i].bodyFatPercentage,
      "_id":response[i].bodyFatPercentage
    }
    // weight[i] = response[i].weight;
    // Date[i] = response[i].Date.toUTCString();
    // bodyFatPercentage[i] = response[i].bodyFatPercentage;
    // _id[i]=response[i].bodyFatPercentage;
  }

  res.send(200, resp);
});
exports.weeklyCheckInHistory = catchAsync(async (req, res, next) => {
  const response = await scModels.find({ UserId: req.user.id });
  var weight = Array(response.length);
  var date = Array(response.length);
  var responseData = Array(response.length - 1);
  for (var i = 0; i < response.length; i++) {
    weight[i] = response[i].weight;
    date[i] = response[i].Date.toUTCString();

  }

  for (var i = 0; i < response.length - 1; i++) {
    if (weight[i] == weight[i + 1]) {
      responseData[i] = {
        Date: date[i],
        Weight: weight[i],
        PreviousWeight: weight[i + 1],
        Status: "Maintenan Weight"
      };
    }else if (weight[i] < weight[i + 1]) {
      responseData[i] = {
        Date: date[i],
        Weight: weight[i],
        PreviousWeight: weight[i + 1],
        Status: "Lose weight"
      };
    }else{
      responseData[i] = {
        Date: date[i],
        Weight: weight[i],
        PreviousWeight: weight[i + 1],
        Status: "Weight gain"
      };
    }
  }
  console.log(responseData);
  res.send(200, responseData);
});
