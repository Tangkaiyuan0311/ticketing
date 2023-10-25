import { CustomError } from "./custom-error";

export class RouteNotFoundError extends CustomError {
    statusCode = 404;
    serializeErrors() {
        return [
            {
                message: "route not found"
            }
        ];
    }

    constructor() { // declare and assign at the same time
        super("route not found");

        // bacause we are extending a build-in class
        Object.setPrototypeOf(this, RouteNotFoundError.prototype);
    }
    
}