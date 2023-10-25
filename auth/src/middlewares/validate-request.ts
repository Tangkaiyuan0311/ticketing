import { Request, Response, NextFunction } from "express"
import { validationResult, Result, ValidationError} from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";



export const validateRequest = (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
        // Extracts the validation errors from an express request
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
             // go to custom error handler for unified-structure formatting
             // If you provide an argument to next():
             // Express will interpret that as an error, and will skip all subsequent middleware, moving directly to the error-handling middleware.
            return next(new RequestValidationError(errors.array()));
        }
        next(); // proceed
    };