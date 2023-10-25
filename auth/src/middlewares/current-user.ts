import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"; // import the whole module as an object

// req.currentUser: UserJwt
interface UserJwt {
    id: string;
    email: string
}

// modify typescript def for Request
// add a custom property: currentUser
declare global {
    namespace Express {
        interface Request {
            currentUser? : UserJwt;
        }
    }
}


// middleware to verify that current user is logged in
// verify jwt in cookies, if logged in, set req.currentUser before next()
export const currentUser = (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
        // if some how we didn't enable the session or jwt is not present in the cookies
        // user is not logged in, req.currentUser is not set
        if (!req.session || !req.session.jwt) {
            return next();
        }
        try {
            const userJwt = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserJwt; // throw error if verification failed
            req.currentUser = userJwt; // current user has been verified
        } catch (err) {}

        next(); // proceed
    };