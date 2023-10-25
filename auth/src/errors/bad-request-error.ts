import { CustomError } from "./custom-error";


export class BadRequestError extends CustomError {
    public statusCode = 400; // request error
    serializeErrors(){
        return [{
            message: this.errMsg
        }]
    }


    constructor(public errMsg: string) { // declare and assign at the same time
        super(errMsg);

        // bacause we are extending a build-in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}