import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import conenctDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});

// import express from "express";
// const app = express();
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (err) => {
//       console.log(`ERROR: ${err.message}`);
//       throw err;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("ERROR :", error);
//     throw err;
//   }
// })();
