import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

// private errors: ValidationError[]

export class RequestValidationError extends CustomError {
    public statusCode = 400; // bad request
    serializeErrors(){
        return this.errors.map((validationError) => {
            if (validationError.type === "field")
            return {
                message: validationError.msg,
                field: validationError.path
            };
            // if not field validation error
            return {
                message: validationError.msg
            }
        });
    }


    constructor(public errors: ValidationError[]) { // declare and assign at the same time
        super("validation error");

        // bacause we are extending a build-in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}