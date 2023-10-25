// for dev/prod

import mongoose from "mongoose";
import { app } from "./app";

// connect to database
const start = async () => {
    // make sure that the env for k8s secret is defined
    if (!process.env.JWT_KEY) {
        throw new Error("env JWT_KEY is not defined"); // as unhandled error
    }
    try {
        // mongodb:// is the protocol definition
        // auth specifies the database name to connect to within the MongoDB service, create if not exist
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth"); 
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

