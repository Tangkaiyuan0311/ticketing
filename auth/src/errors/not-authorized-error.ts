import { CustomError } from "./custom-error";


export class NotAuthorizedError extends CustomError {
    public statusCode = 401; // request error
    serializeErrors(){
        return [{
            message: "Not Authorized"
        }]
    }


    constructor() { // declare and assign at the same time
        super("Not Authorized");
        // bacause we are extending a build-in class
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
}