import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env",
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port: ${process.env.PORT}`);
        });

        app.on("error", (error) => {
            console.log("ERROR in src/index.js due to app.on()", error);
            throw error;
        });

    })
    .catch((err) => {
        console.log(`MongoDb Connection Failed in sr/index.js ${err}`);
    });



    











    
// import { DB_NAME } from "./constants.js";
// const app = express();

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.log("ERROR", error);
//             throw error;
//         });
//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port: ${process.env.PORT}`);
//         });
//     } catch (error) {
//         console.log("ERROR", error);
//         throw err;
//     }
// })();
