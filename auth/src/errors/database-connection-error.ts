import { CustomError } from "./custom-error";


export class DatabaseConnectionError extends CustomError {
    public statusCode = 500; // server error
    serializeErrors(){
        return [{
            message: this.reason,
        }]
    }


    public reason = "database connection error";
    constructor() { // declare and assign at the same time
        super("database connection error");

        // bacause we are extending a build-in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}