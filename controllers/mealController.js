const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const calModels = require("./../models/calModels");
const jwt = require("jsonwebtoken");
const User = require("./../models/useModels");
const scModels = require("./../models/scModels");

exports.addMeal = catchAsync(async (req, res, next) => {
  var today = new Date();
  // let newtoday = today.getTime() % 86400000;
  // newttoday = today.getTime() - newtoday;

  // newttoday=newttoday-(86400000*7);

  const newMeal = await calModels.create({
    MealType: req.body.MealType,
    FoodName: req.body.FoodName,
    Calories: req.body.Calories,
    Protein: req.body.Protein,
    Carbs: req.body.Carbs,
    Fats: req.body.Fats,
    UserId: req.user.id,
    Date: today.getTime(),
  });
  res.status(200).json({
    status: "success",
    message: "Meal is added successfully!",
  });
});
exports.getMeal = catchAsync(async (req, res, next) => {
  var today = new Date();
  let newtoday = today.getTime() % 86400000;
  newttoday = today.getTime() - newtoday;
  const food = await calModels.find({
    $and: [
      { MealType: req.body.MealType },
      { Date: { $gte: newttoday } },
      { UserId: req.user.id },
    ],
  });

  res.status(200).json({
    status: "success",
    result: food,
  });
});
exports.delete = catchAsync(async (req, res, next) => {
  const ress = await calModels.findByIdAndRemove(req.body.id);
  res.status(200).json({
    status: "success",
    data: ress,
  });
});
exports.getCalories = catchAsync(async (req, res, next) => {
  const BodyFat = req.user.BodyFat;
  const Goal = req.user.Goal;

  res.status(200).json({
    status: "success",
    Data: {
      BodyFat: req.user.BodyFat,
      Goal: req.user.Goal,
    },
  });
});
exports.getTodayMeals = catchAsync(async (req, res, next) => {
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

  const reasult = [
    {
      title: "Brakfast",
      Calories: BreakfastCalories,
      Protein: BreakfastProtein,
      Carbs: BreakfastCarbs,
      Fats: BreakfastFats,
    },
    {
      title: "lunch",
      Calories: lunchCalories,
      Protein: lunchProtein,
      Carbs: lunchCarbs,
      Fats: lunchFats,
    },
    {
      title: "Dinner",
      Calories: DinnerCalories,
      Protein: DinnerProtein,
      Carbs: DinnerCarbs,
      Fats: DinnerFats,
    },
  ];

  res.status(200).json({
    status: "success",
    reasult,
  });
});
exports.lastWeekCal = catchAsync(async (req, res, next) => {
  var today = new Date();
  let newtoday = today.getTime() % 86400000;
  newttoday = today.getTime() - newtoday;
  let day1 = newttoday - 86400000;
  let day2 = newttoday - 86400000 * 2;
  let day3 = newttoday - 86400000 * 3;
  let day4 = newttoday - 86400000 * 4;
  let day5 = newttoday - 86400000 * 5;
  let day6 = newttoday - 86400000 * 6;
  let day7 = newttoday - 86400000 * 7;

  const detailsDay1 = await calModels.find({
    $and: [
      { UserId: req.user.id },
      { Date: { $gte: day1 } },
      { Date: { $lte: newttoday } },
    ],
  });
  const detailsDay2 = await calModels.find({
    $and: [
      { UserId: req.user.id },
      { Date: { $gte: day2 } },
      { Date: { $lte: day1 } },
    ],
  });
  const detailsDay3 = await calModels.find({
    $and: [
      { UserId: req.user.id },
      { Date: { $gte: day3 } },
      { Date: { $lte: day1 } },
    ],
  });
  const detailsDay4 = await calModels.find({
    $and: [
      { UserId: req.user.id },
      { Date: { $gte: day4 } },
      { Date: { $lte: day3 } },
    ],
  });
  const detailsDay5 = await calModels.find({
    $and: [
      { UserId: req.user.id },
      { Date: { $gte: day5 } },
      { Date: { $lte: day4 } },
    ],
  });
  const detailsDay6 = await calModels.find({
    $and: [
      { UserId: req.user.id },
      { Date: { $gte: day6 } },
      { Date: { $lte: day5 } },
    ],
  });
  const detailsDay7 = await calModels.find({
    $and: [
      { UserId: req.user.id },
      { Date: { $gte: day7 } },
      { Date: { $lte: day6 } },
    ],
  });

  //=================================================================================================================
  let Day1Date = "";
  let Day1Calories = 0;
  let Day1Protein = 0;
  let Day1Carbs = 0;
  let Day1Fats = 0;

  let Day2Date = "";
  let Day2Calories = 0;
  let Day2Protein = 0;
  let Day2Carbs = 0;
  let Day2Fats = 0;

  let Day3Date = "";
  let Day3Calories = 0;
  let Day3Protein = 0;
  let Day3Carbs = 0;
  let Day3Fats = 0;

  let Day4Date = "";
  let Day4Calories = 0;
  let Day4Protein = 0;
  let Day4Carbs = 0;
  let Day4Fats = 0;

  let Day5Date = "";
  let Day5Calories = 0;
  let Day5Protein = 0;
  let Day5Carbs = 0;
  let Day5Fats = 0;

  let Day6Date = "";
  let Day6Calories = 0;
  let Day6Protein = 0;
  let Day6Carbs = 0;
  let Day6Fats = 0;

  let Day7Date = "";
  let Day7Calories = 0;
  let Day7Protein = 0;
  let Day7Carbs = 0;
  let Day7Fats = 0;

  detailsDay1.forEach((es) => {
    var dataa = new Date(es.Date);
    Day1Date = dataa.toDateString();
    Day1Calories = Day1Calories + es.Calories;
    Day1Protein = Day1Protein + es.Protein;
    Day1Carbs = Day1Carbs + es.Carbs;
    Day1Fats = Day1Fats + es.Fats;
  });
  detailsDay2.forEach((es) => {
    var dataa = new Date(es.Date);
    Day2Date = dataa.toDateString();
    Day2Calories = Day2Calories + es.Calories;
    Day2Protein = Day2Protein + es.Protein;
    Day2Carbs = Day2Carbs + es.Carbs;
    Day2Fats = Day2Fats + es.Fats;
  });
  detailsDay3.forEach((es) => {
    var dataa = new Date(es.Date);
    Day3Date = dataa.toDateString();
    Day3Calories = Day3Calories + es.Calories;
    Day3Protein = Day3Protein + es.Protein;
    Day3Carbs = Day3Carbs + es.Carbs;
    Day3Fats = Day3Fats + es.Fats;
  });
  detailsDay4.forEach((es) => {
    var dataa = new Date(es.Date);
    Day4Date = dataa.toDateString();
    Day4Calories = Day4Calories + es.Calories;
    Day4Protein = Day4Protein + es.Protein;
    Day4Carbs = Day4Carbs + es.Carbs;
    Day4Fats = Day4Fats + es.Fats;
  });
  detailsDay5.forEach((es) => {
    var dataa = new Date(es.Date);
    Day5Date = dataa.toDateString();
    Day5Calories = Day5Calories + es.Calories;
    Day5Protein = Day5Protein + es.Protein;
    Day5Carbs = Day5Carbs + es.Carbs;
    Day5Fats = Day5Fats + es.Fats;
  });
  detailsDay6.forEach((es) => {
    var dataa = new Date(es.Date);
    Day6Date = dataa.toDateString();
    Day6Calories = Day6Calories + es.Calories;
    Day6Protein = Day6Protein + es.Protein;
    Day6Carbs = Day6Carbs + es.Carbs;
    Day6Fats = Day6Fats + es.Fats;
  });
  detailsDay7.forEach((es) => {
    var dataa = new Date(es.Date);
    Day7Date = dataa.toDateString();
    Day7Calories = Day7Calories + es.Calories;
    Day7Protein = Day7Protein + es.Protein;
    Day7Carbs = Day7Carbs + es.Carbs;
    Day7Fats = Day7Fats + es.Fats;
  });

  const result = [
    {
      id: 1,
      Date: Day1Date,
      Calories: Day1Calories,
      Protein: Day1Protein,
      Carbs: Day1Carbs,
      Fats: Day1Fats,
    },
    {
      id: 2,
      Date: Day2Date,
      Calories: Day2Calories,
      Protein: Day2Protein,
      Carbs: Day2Carbs,
      Fats: Day2Fats,
    },
    {
      id: 3,
      Date: Day3Date,
      Calories: Day3Calories,
      Protein: Day3Protein,
      Carbs: Day3Carbs,
      Fats: Day3Fats,
    },
    {
      id: 4,
      Date: Day4Date,
      Calories: Day4Calories,
      Protein: Day4Protein,
      Carbs: Day4Carbs,
      Fats: Day4Fats,
    },
    {
      id: 5,
      Date: Day5Date,
      Calories: Day5Calories,
      Protein: Day5Protein,
      Carbs: Day5Carbs,
      Fats: Day5Fats,
    },
    {
      id: 6,
      Date: Day6Date,
      Calories: Day6Calories,
      Protein: Day6Protein,
      Carbs: Day6Carbs,
      Fats: Day6Fats,
    },
    {
      id: 7,
      Date: Day7Date,
      Calories: Day7Calories,
      Protein: Day7Protein,
      Carbs: Day7Carbs,
      Fats: Day7Fats,
    },
  ];
  //==================================================================================================================

  res.send(200, result);
});
exports.diaryhistory = catchAsync(async (req, res, next) => {
  var today = new Date();
  let newtoday = today.getTime() % 86400000;
  newttoday = today.getTime() - newtoday;

  //====================================================================================
  let BreakfastCalories = [0, 0, 0, 0, 0, 0, 0, 0];
  let BreakfastProtein = [0, 0, 0, 0, 0, 0, 0, 0];
  let BreakfastCarbs = [0, 0, 0, 0, 0, 0, 0, 0];
  let BreakfastFats = [0, 0, 0, 0, 0, 0, 0, 0];
  //====================================================================================
  let lunchCalories = [0, 0, 0, 0, 0, 0, 0, 0];
  let lunchProtein = [0, 0, 0, 0, 0, 0, 0, 0];
  let lunchCarbs = [0, 0, 0, 0, 0, 0, 0, 0];
  let lunchFats = [0, 0, 0, 0, 0, 0, 0, 0];
  //====================================================================================
  let DinnerCalories = [0, 0, 0, 0, 0, 0, 0, 0];
  let DinnerProtein = [0, 0, 0, 0, 0, 0, 0, 0];
  let DinnerCarbs = [0, 0, 0, 0, 0, 0, 0, 0];
  let DinnerFats = [0, 0, 0, 0, 0, 0, 0, 0];
  //====================================================================================
  let Calories = [0, 0, 0, 0, 0, 0, 0, 0];
  let Protein = [0, 0, 0, 0, 0, 0, 0, 0];
  let Carbs = [0, 0, 0, 0, 0, 0, 0, 0];
  let Fats = [0, 0, 0, 0, 0, 0, 0, 0];

  //===========================================================
  for (let i = 0; i < 7; i++) {
    const Brakfast = await calModels.find({
      $and: [
        { UserId: req.user.id },
        { MealType: "Brakfast" },
        { Date: { $gte: newttoday - 86400000 } },
        { Date: { $lte: newttoday } },
      ],
    });

    const lunch = await calModels.find({
      $and: [
        { UserId: req.user.id },
        { MealType: "lunch" },
        { Date: { $gte: newttoday - 86400000 } },
        { Date: { $lte: newttoday } },
      ],
    });

    const Dinner = await calModels.find({
      $and: [
        { UserId: req.user.id },
        { MealType: "Dinner" },
        { Date: { $gte: newttoday - 86400000 } },
        { Date: { $lte: newttoday } },
      ],
    });

    Brakfast.forEach((es) => {
      BreakfastCalories[i] = BreakfastCalories[i] + es.Calories;
      BreakfastProtein[i] = BreakfastProtein[i] + es.Protein;
      BreakfastCarbs[i] = BreakfastCarbs[i] + es.Carbs;
      BreakfastFats[i] = BreakfastFats[i] + es.Fats;
    });
    lunch.forEach((es) => {
      lunchCalories[i] = lunchCalories[i] + es.Calories;
      lunchProtein[i] = lunchProtein[i] + es.Protein;
      lunchCarbs[i] = lunchCarbs[i] + es.Carbs;
      lunchFats[i] = lunchFats[i] + es.Fats;
    });
    Dinner.forEach((es) => {
      DinnerCalories[i] = DinnerCalories[i] + es.Calories;
      DinnerProtein[i] = DinnerProtein[i] + es.Protein;
      DinnerCarbs[i] = DinnerCarbs[i] + es.Carbs;
      DinnerFats[i] = DinnerFats[i] + es.Fats;
    });
    //=====================================================================
    const ddd = newttoday;
    const check = await scModels.findOne({
      $and: [
        { UserId: req.user.id },
        { $or: [{ Date: { $lte: ddd } }, { Date: ddd }] },
      ],
    });


    Calories[i] =
      (BreakfastCalories[i] + lunchCalories[i] + DinnerCalories[i]) /
        check.Calories >
      1
        ? 1
        : (BreakfastCalories[i] + lunchCalories[i] + DinnerCalories[i]) /
        check.Calories;
    Protein[i] =
      (BreakfastProtein[i] + lunchProtein[i] + DinnerProtein[i]) /
        check.Protein >
      1
        ? 1
        : (BreakfastProtein[i] + lunchProtein[i] + DinnerProtein[i]) /
          check.Protein;
    Carbs[i] =
      (BreakfastCarbs[i] + lunchCarbs[i] + DinnerCarbs[i]) / check.Carbs > 1
        ? 1
        : (BreakfastCarbs[i] + lunchCarbs[i] + DinnerCarbs[i]) / check.Carbs;
    Fats[i] =
      (BreakfastFats[i] + lunchFats[i] + DinnerFats[i]) / check.Fats > 1
        ? 1
        : (BreakfastFats[i] + lunchFats[i] + DinnerFats[i]) / check.Fats;

    //====================================================================
    newttoday = newttoday - 86400000;
  }
  const reasult = [
    {
      title: "Brakfast",
      Calories: BreakfastCalories,
      Protein: BreakfastProtein,
      Carbs: BreakfastCarbs,
      Fats: BreakfastFats,
    },
    {
      title: "lunch",
      Calories: lunchCalories,
      Protein: lunchProtein,
      Carbs: lunchCarbs,
      Fats: lunchFats,
    },
    {
      title: "Dinner",
      Calories: DinnerCalories,
      Protein: DinnerProtein,
      Carbs: DinnerCarbs,
      Fats: DinnerFats,
    },
    {
      title: "ProgressChart",
      Calories: Calories,
      Protein: Protein,
      Carbs: Carbs,
      Fats: Fats,
    },
  ];

  res.status(200).json({
    status: "success",
    reasult: reasult,
  });
});
