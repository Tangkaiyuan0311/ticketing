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

    constructor(requestURL: String) { // declare and assign at the same time
        super("route not found");
        console.log(requestURL);
        // bacause we are extending a build-in class
        Object.setPrototypeOf(this, RouteNotFoundError.prototype);
    }
    
}