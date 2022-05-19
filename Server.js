const mongoose = require("mongoose");
const dotenv = require("dotenv");

const fs = require("fs");
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down..."+err);
  server.close(() => {
    process.exit(1);
  });
});
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB =process.env.DATABASE_LOCAL;
console.clear();
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
     useUnifiedTopology: true,
  })
  .then(() => {console.log("DB connection successful!");});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


