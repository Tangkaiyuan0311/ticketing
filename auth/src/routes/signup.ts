import express from "express";
import { Request, Response, NextFunction} from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken"; // import the whole module as an object
import { validateRequest } from "../middlewares/validate-request";



const router = express.Router();

// add validator middle-ware 
// post body: {email, password}
// A validation chain has three kinds of methods: validators, sanitizers and modifiers
// return created user
router.post(
    "/api/users/signup", 
    // express validator, append validation error to request
    [
        body("email")
        .isEmail()
        .withMessage("Email must be valid"),

        body("password")
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage("Password mush be in length: 4~20")
    ],
    validateRequest,
    // all error in the await will be handled by express automatically (error-handler)
    async (req: Request, res: Response, next: NextFunction) => {
        const {email, password} = req.body;
        // try to create a user ...
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return next(new BadRequestError("email already exists"));
        }
        else {
            console.log("Adding new user...");
            // actual work
            const newUser = User.addUser({email, password});
            await newUser.save();
            
            // create a jwt for this new user, for latter authentication, communication, etc.
            // all services use the signing key to verify the jwt of from user cookies
            // need to share this key among services in some way (k8s): as env var inside each container
            const userJwt = jwt.sign(
                {
                    id: newUser.id,
                    email: newUser.email
                }, 
                // "asdf" // signing key
                process.env.JWT_KEY! // make sure defined at the start-up of the application
                // non-null assertion operator
                // tells the tsc to treat the variable as if it is not null or undefined.
            );

            // store the jwt in the cookie session, 
            // When you set req.session, the middleware automatically takes care of serializing, encrypting (if keys are provided), 
            // and setting the session data as a cookie on the response object for you.
            // the response will have a header: Set-cookie
            req.session = {
                jwt: userJwt
            }

            return res.status(201).send(newUser);
        }


    }
);

export { router as signupRouter };