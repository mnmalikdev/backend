// note : use Object.values OR for loop with length caching for traversing the API response.

// const fetchExerciseData = async (targetMuscle, trainingType) => {
//   let data;
//   let options = {
//     method: "GET",
//     headers: {
//       "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
//       "X-RapidAPI-Key": "a36c20a5bcmshb529a2251134ea8p1997a9jsn28babe874eb1",
//     },
//   };
//   if (targetMuscle === "fullBody") {
//     return (data = (await fetch("https://exercisedb.p.rapidapi.com/exercises", options)).json());
//   }
//   if (trainingType === "BodyWeight") {
//     return (data = (await fetch("https://exercisedb.p.rapidapi.com/exercises/body%20weight", options)).json());
//   } else {
//     return (data = (await fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${targetMuscle}`, options)).json);
//   }
//   // use fetch api to get response
//   // 2 kind of response data.
//   // 1. for full body , we will have all kinds of data to build workout.
//   // 2. for specific muscle, we will have only one specific kind of  data to build a workout.
// };
