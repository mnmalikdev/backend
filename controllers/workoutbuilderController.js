const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const workoutbuilder = require("./../models/workoutBuilderModels");
const jwt = require("jsonwebtoken");

// build an array of objects for the workouts

const workouts = [
  // workout 1
  {
    id: 001,
    type: "BodyBuilding",
    intensity: "intense",
    targetMuscle: "fullBody",
    name: "Full Body Push Workout",
    exercises: [
      {
        name: "Dumbbell Bench Press",
        sets: "4",
        reps: "8-12",
      },
      {
        name: "Standing Cable Fly",
        sets: "3",
        reps: "12-15",
      },
      {
        name: "Incline Bench Press",
        sets: "4",
        reps: "6-8",
      },
      {
        name: "Overhead Press",
        sets: "4",
        reps: "8-12",
      },
      {
        name: "Lateral Raise",
        sets: "3",
        reps: "12-15",
      },
      {
        name: "	Skullcrusher",
        sets: "3",
        reps: "12-15",
      },
    ],
  },
  {
    id: 002,
    type: "BodyBuilding",
    intensity: "intense",
    targetMuscle: "fullBody",
    name: "Full Body Pull Workout",
    exercises: [
      {
        name: "	Lat Pull Down",
        sets: "4",
        reps: "8-12",
      },
      {
        name: "	T-Bar Row",
        sets: "4",
        reps: "12-15",
      },
      {
        name: "Close Grip Pull Down",
        sets: "3",
        reps: "12-15",
      },
      {
        name: "Face Pull",
        sets: "4",
        reps: "15-20",
      },
      {
        name: "Cable Curl",
        sets: "3",
        reps: "12-15",
      },
      {
        name: "	Reverse Grip Barbell Curl",
        sets: "3",
        reps: "12-15",
      },
    ],
  },
  {
    id: 003,
    type: "BodyBuilding",
    intensity: "intense",
    targetMuscle: "Legs",
    name: "Legs Workout 1",
    exercises: [
      {
        name: "Squat",
        sets: "4",
        reps: "8-12",
      },
      {
        name: "Leg Press",
        sets: "4",
        reps: "12-15",
      },
      {
        name: "Leg Extension",
        sets: "3",
        reps: "12-15",
      },
      {
        name: "Leg Curl",
        sets: "4",
        reps: "10-12",
      },
      {
        name: "Calf Press",
        sets: "4",
        reps: "15",
      },
      {
        name: "Plank",
        sets: "3",
        reps: "1 Minute",
      },
    ],
  },
  {
    id: 004,
    type: "BodyBuilding",
    intensity: "intense",
    targetMuscle: "Chest",
    name: "Chest Workout 1",
    exercises: [
      {
        name: "Incline Barbell Bench Press",
        sets: "3",
        reps: "12",
      },
      {
        name: "Flat Dumbbell Bench Press",
        sets: "3",
        reps: "15",
      },
      {
        name: "Cable Crossover",
        sets: "3",
        reps: "12",
      },
      {
        name: "Cable Crossover lower pec",
        sets: "3",
        reps: "12",
      },
      {
        name: "Dumbbell Fly",
        sets: "3",
        reps: "12",
      },
      {
        name: "Dumbbell Fly lower pec",
        sets: "3",
        reps: "12",
      },
      {
        name: "Dumbbell Fly upper pec",
        sets: "3",
        reps: "12",
      },
    ],
  },
  {
    id: 005,
    type: "BodyBuilding",
    intensity: "mild",
    targetMuscle: "Back",
    name: "Back Workout 1",
    exercises: [
      {
        name: "Bent-Over Barbell Row",
        sets: "3",
        reps: "10",
      },
      {
        name: "Dumbbell Pullover",
        sets: "3",
        reps: "12",
      },
      {
        name: "Wide Grip Lat Pulldown",
        sets: "3",
        reps: "12",
      },
      {
        name: "Dumbbell Shrug",
        sets: "3",
        reps: "12",
      },
    ],
  },
  {
    id: 006,
    type: "BodyBuilding",
    intensity: "Mild",
    targetMuscle: "Arms",
    name: "Arms Workout 1",
    exercises: [
      {
        name: "Barbell Curl",
        sets: "3",
        reps: "12",
      },
      {
        name: "Hammer Curl",
        sets: "4",
        reps: "15",
      },
      {
        name: "Cable Curl",
        sets: "3",
        reps: "12",
      },
      {
        name: "Zottman Curl",
        sets: "3",
        reps: "12",
      },
    ],
  },
  {
    id: 007,
    type: "BodyBuilding",
    intensity: "moderate",
    targetMuscle: "Legs",
    name: "Legs Workout 2",
    exercises: [
      {
        name: "Deadlift",
        sets: "3",
        reps: "6",
      },
      {
        name: "Lying Leg Curl",
        sets: "3",
        reps: "12",
      },
      {
        name: "Walking Lunge",
        sets: "3",
        reps: "12",
      },
      {
        name: "Front Squat",
        sets: "4",
        reps: "8",
      },
      {
        name: "Calf Press",
        sets: "3",
        reps: "12",
      },
    ],
  },
  {
    id: 010,
    type: "BodyBuilding",
    intensity: "mild",
    targetMuscle: "Legs",
    name: " Leg Workout 3",
    exercises: [
      {
        name: "Hamstring Curl",
        sets: "4",
        reps: "15",
      },
      {
        name: "Romanian Deadlift",
        sets: "3",
        reps: "15",
      },
      {
        name: "Leg Press",
        sets: "2",
        reps: "15",
      },
      {
        name: "Step-Up",
        sets: "3",
        reps: "12",
      },
      {
        name: "Calf Raises",
        sets: "3",
        reps: "12",
      },
    ],
  },
  {
    id: 011,
    type: "BodyBuilding",
    intensity: "mild",
    targetMuscle: "Shoulders",
    name: " Shoulders Workout 1",
    exercises: [
      {
        name: "Dumbell Lateral Raise",
        sets: "4",
        reps: "12",
      },
      {
        name: "Rear Delt Cable Fly",
        sets: "4",
        reps: "15",
      },
      {
        name: "Seated Dumbbell Press",
        sets: "5",
        reps: "10",
      },
      {
        name: "Upright Barbell Row",
        sets: "4",
        reps: "12",
      },
      {
        name: "Seated Machine Lateral Raise",
        sets: "3",
        reps: "15",
      },
    ],
  },
  {
    id: 012,
    type: "BodyBuilding",
    intensity: "mild",
    targetMuscle: "Legs",
    name: " Legs Workout 4",
    exercises: [
      {
        name: "Leg Press",
        sets: "5",
        reps: "15",
      },
      {
        name: "Machine Hack Squat",
        sets: "3",
        reps: "10",
      },
      {
        name: "Elevated Stiff Legged Deadlift",
        sets: "3",
        reps: "15",
      },
      {
        name: "Lying Leg Curl",
        sets: "3",
        reps: "12",
      },
      {
        name: "Walking Lunge",
        sets: "3",
        reps: "12",
      },
    ],
  },
  {
    id: 013,
    type: "BodyBuilding",
    intensity: "mild",
    targetMuscle: "Chest",
    name: " Chest Workout 2",
    exercises: [
      {
        name: "Barbell Bench Press",
        sets: "3",
        reps: "12",
      },
      {
        name: "Dumbbell Bench Press",
        sets: "4",
        reps: "15",
      },
      {
        name: "Decline Bench Press",
        sets: "3",
        reps: "12",
      },
      {
        name: "Dumbell Pullover",
        sets: "3",
        reps: "12",
      },
    ],
  },
  {
    id: 014,
    type: "BodyBuilding",
    intensity: "mild",
    targetMuscle: "Back",
    name: " Back Workout 2",
    exercises: [
      {
        name: "	Behind Neck Lat Pulldown",
        sets: "3",
        reps: "12",
      },
      {
        name: "	Seated Cable Row",
        sets: "2",
        reps: "15",
      },
      {
        name: "Deadlift",
        sets: "3",
        reps: "5",
      },
      {
        name: "Cable Face Pull",
        sets: "3",
        reps: "15",
      },
    ],
  },
  {
    id: 015,
    type: "BodyBuilding",
    intensity: "Moderate",
    targetMuscle: "Arms",
    name: " Arms Workout 2",
    exercises: [
      {
        name: "Tricep Cable Pushdown",
        sets: "3",
        reps: "15",
      },
      {
        name: "Alternating Dumbbell Curls",
        sets: "4",
        reps: "15",
      },
      {
        name: "Barbell Curl",
        sets: "4",
        reps: "12",
      },
      {
        name: "Cable tricep extension",
        sets: "3",
        reps: "12",
      },
      {
        name: "Wrist Curls",
        sets: "5",
        reps: "8",
      },
    ],
  },
  {
    id: 016,
    type: "BodyBuilding",
    intensity: "mild",
    targetMuscle: "Abs",
    name: " Abs Workout 1",
    exercises: [
      {
        name: "Cable Crunch",
        sets: "2",
        reps: "15",
      },
      {
        name: "Ab Crunch Machine",
        sets: "2",
        reps: "10",
      },
      {
        name: "Russian Twist",
        sets: "2",
        reps: "15",
      },
    ],
  },
  {
    id: 017,
    type: "BodyBuilding",
    intensity: "Moderate",
    targetMuscle: "Shoulders",
    name: "Shoulders Workout 2",
    Exercise: [
      {
        name: "Standing Shoulder Press",
        sets: "3-6",
        reps: "8",
      },
      {
        name: "Lateral Raise",
        sets: "3-6",
        reps: "12",
      },
      {
        name: "Machine Shoulder Press",
        sets: "5-6",
        reps: "12",
      },
      {
        name: "Cable Front Raise",
        sets: "3-6",
        reps: "12",
      },
      {
        name: "Cable Upright Row",
        sets: "2-6",
        reps: "12",
      },
      {
        name: "Cable Face Pull",
        sets: "3-6",
        reps: "12",
      },
    ],
  },
  {
    id: 020,
    type: "BodyBuilding",
    intensity: "Intense",
    targetMuscle: "Arms",
    name: "Arms Workout 3",
    exercises: [
      {
        name: "Barbell Curl",
        sets: "1-5",
        reps: "12",
      },
      {
        name: "Preacher Curl",
        sets: "3-5",
        reps: "10",
      },
      {
        name: "Incline Dumbbell Curl",
        sets: "4-6",
        reps: "13",
      },
      {
        name: "Cable Tricep Extension",
        sets: "5-6",
        reps: "12",
      },
      {
        name: "Close Grip Bench Press",
        sets: "3-6",
        reps: "12",
      },
      {
        name: "Overhead Dumbbell Tricep Extension",
        sets: "3-6",
        reps: "12",
      },
    ],
  },
  {
    id: 021,
    type: "BodyBuilding",
    intensity: "Intense",
    targetMuscle: "Legs",
    name: "Legs Workout 5",
    exercises: [
      {
        name: "Deadlift",
        sets: "1-6",
        reps: "2-12",
      },
      {
        name: "Front Squat",
        sets: "1-6",
        reps: "2-12",
      },
      {
        name: "Hack Squat",
        sets: "1-6",
        reps: "2-12",
      },
      {
        name: "Seated Leg Curl",
        sets: "1-6",
        reps: "2-12",
      },
      {
        name: "Leg Extension",
        sets: "1-6",
        reps: "2-12",
      },
      {
        name: "Seated Calf Raise",
        sets: "1-6",
        reps: "2-12",
      },
    ],
  },
  {
    id: 022,
    type: "BodyBuilding",
    intensity: "Intense",
    targetMuscle: "Shoulders",
    name: "Shoulders Workout 3",
    exercises: [
      {
        name: "Seated Barbell Press",
        sets: "5",
        reps: "5",
      },
      {
        name: "Hammer Overhead Press",
        sets: "8",
        reps: "8",
      },
      {
        name: "Seated Dumbbell Extensions",
        sets: "3",
        reps: "8",
      },
      {
        name: "Dumbbell Side Laterals",
        sets: "6",
        reps: "8",
      },
      {
        name: "Rear Delt Fly",
        sets: "6",
        reps: "8",
      },
      {
        name: "Barbell Upright Row",
        sets: "6",
        reps: "8",
      },
    ],
  },
  {
    id: 023,
    type: "PowerLifting",
    intensity: "Mild",
    targetMuscle: "Chest",
    name: "Mild Power Builder Chest Focused",
    exercises: [
      {
        name: "Power Clean",
        sets: "2",
        reps: "10",
      },
      {
        name: "Bench Press",
        sets: "2",
        reps: "10",
      },
      {
        name: "Incline Fly",
        sets: "3",
        reps: "12",
      },

      {
        name: "EZ Bar Extension",
        sets: "3",
        reps: "8",
      },
      {
        name: "Pullover",
        sets: "3",
        reps: "8",
      },
      {
        name: "Close Grip Press",
        sets: "3",
        reps: "8",
      },
    ],
  },
  {
    id: 024,
    type: "PowerLifting",
    intensity: "Moderate",
    targetMuscle: "Back",
    name: "Moderate Power Builder Back Focused",
    exercises: [
      {
        name: "Deadlift",
        sets: "2",
        reps: "10",
      },
      {
        name: "Bent Over Row",
        sets: "3",
        reps: "8",
      },
      {
        name: "Lat Pull Down",
        sets: "3",
        reps: "12",
      },
      {
        name: "Preacher Curl",
        sets: "2",
        reps: "8",
      },
    ],
  },
  {
    id: 025,
    type: "PowerLifting",
    intensity: "Intense",
    targetMuscle: "Legs",
    name: "Intense Power Builder Legs Focused",
    exercises: [
      {
        name: "Squat",
        sets: "2",
        reps: "10",
      },
      {
        name: "Leg Extension",
        sets: "1",
        reps: "30",
      },
      {
        name: "Calf Raise",
        sets: "3",
        reps: "25",
      },
    ],
  },
];

exports.addWorkout = catchAsync(async (req, res, next) => {
  var nowDate = new Date();
  const newWorkoutbuilder = await workoutbuilder.create({
    WorkoutType: {
      UserId: req.user.id,
      workoutName: req.body.workout,
      targetMuscle: req.body.targetMuscle,
      Date: nowDate,
      intensity: req.body.intensity,
    },
  });
});

exports.generateWorkout = catchAsync(async (req, res, next) => {
  // take workout-type, age , weight, hours of sleep, number of training days, training intensity and generate a workout, goal
  const userInfo = {
    numberOfTrainingDays: req.body.numberOfTrainingDays, //7
    trainingIntensity: req.body.trainingIntensity, //mild , moderate , intense
    targetMuscle: req.body.targetMuscle,
    trainingType: req.body.trainingType,
    /*
      // sets per week for each muscle group
      0:"back - 10–25"
      2:"chest - 10–22"
      3: "arms - 4–18"
      4:"Legs - 8-15" 
      6:"shoulders - 8–26"
      9:"waist - 0–10",
      10:"full body - 12 sets per muscle group across the week"
      */
  };
  const response = workouts.filter((item) => {
    return item.type == userInfo.trainingType && item.intensity == userInfo.trainingIntensity && item.targetMuscle == userInfo.targetMuscle;
  });

  res.status(200).json({
    status: "success",
    message: response,
  });
});
