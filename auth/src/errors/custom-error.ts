// all custom error must extends this abstract class
// use abstract class vs interface:
// tsc do create a class in js, so we van use instanceof with CustomError
export abstract class CustomError extends Error {
    abstract statusCode: number;
    // for response normalization
    // an array of (message, field)
    abstract serializeErrors(): {
        message: string,
        field?: string
    }[];

    constructor(errorMsg: string) { // for debug
        super(errorMsg);

        // bacause we are extending a build-in class
        Object.setPrototypeOf(this, CustomError.prototype);
    }

}