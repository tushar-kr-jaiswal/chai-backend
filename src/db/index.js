import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const conenctDB = async () => {
  try {
    const conenctionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MONGODB CONNECTION !! DB HOST: ${conenctionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED in src/db/index.js-- ", error);
    process.exit(1);
  }
};
export default conenctDB;