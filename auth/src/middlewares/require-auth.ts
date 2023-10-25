import { Request, Response, NextFunction } from "express"
import { NotAuthorizedError } from "../errors/not-authorized-error";


// middleware after currentUser
// check req.currentUser before next()
// if not authorized: throw NotAuthorizedError
export const requireAuth = (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
        if (!req.currentUser) {
            throw new NotAuthorizedError();
        }
        next(); // proceed
    };