import { Request, Response, NextFunction } from "express"
import { CustomError } from "../errors/custom-error";

// express tell apart error handler and other middlewares by the number of arguments
export const errorHandler = (
    err: Error, // err is of custom Error subclass from other ts files, passed from upper middelware
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
        if (err instanceof CustomError) {
            console.log("Processing CustomError: ", err.message);
            return res.status(err.statusCode).send({
                errors: err.serializeErrors()
            });
        }

        // all other error
        console.log("Processing other error...");
        res.status(400).send({
            errors: [
                {
                    message: "something went wrong: " + err.message
                }
            ]
        });
    };