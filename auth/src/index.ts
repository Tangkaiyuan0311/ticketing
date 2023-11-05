// for dev/prod

import mongoose from "mongoose";
import { app } from "./app";

// connect to database
const start = async () => {
    // make sure that the env for k8s secret is defined
    if (!process.env.JWT_KEY) {
        throw new Error("env JWT_KEY is not defined"); // as unhandled error
    }
    if (!process.env.MONGO_URI) {
        throw new Error("env MONGO_URI is not defined");
    }
    try {
        // mongodb:// is the protocol definition
        // auth specifies the database name to connect to within the MongoDB service, create if not exist
        await mongoose.connect(process.env.MONGO_URI); 
        console.log("Connected to mongodb for auth");
    }
    catch (err) {
        console.error(err);

    }
}


app.listen(3000, () => {
    console.log("Listening on port number 3000");
})

start();

