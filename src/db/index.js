import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        connectionInstance.connection.on("error", (err) => {
            console.log(`ERROR: ${err.message}`);
            throw err;
        });
        console.log(
            `MONGODB CONNECTION SUCCESSFUL !! DB HOST: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED in src/db/index.js-- ", error);
        process.exit(1);
    }
};
export default connectDB;
