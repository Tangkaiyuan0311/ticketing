import express from "express";
import { Request, Response, NextFunction} from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken"; // import the whole module as an object
import { validateRequest } from "../middlewares/validate-request";
import { Password } from "../services/password";



const router = express.Router();

// add validator middle-ware 
// post body: {email, password}
// A validation chain has three kinds of methods: validators, sanitizers and modifiers
// return found user
router.post(
    "/api/users/signin", 
    // express validator, append validation error to request
    [
        body("email")
        .isEmail()
        .withMessage("Email must be valid"),

        body("password")
        .trim()
        // .isLength({min: 4, max: 20}) // ignore this check for extensible code
        .notEmpty()
        .withMessage("You must supply a password")
    ],
    validateRequest, 
    // all error in the await will be handled by express automatically (error-handler)
    async (req: Request, res: Response, next: NextFunction) => {
        
        const {email, password} = req.body;
        // try to find this user ...
        const existingUser = await User.findOne({email});

        if (!existingUser) {
            return next(new BadRequestError("Bad credentials"));
        }
        else {
            // password comparison
            const passwordMatch = await Password.equal(existingUser.password, password);
            if (!passwordMatch) {
                return next(new BadRequestError("Bad credentials"));
            }
            
            console.log("User is validated");
            // create a jwt for this new user, for latter authentication, communication, etc.
            // all services use the signing key to verify the jwt of from user cookies
            // need to share this key among services in some way (k8s): as env var inside each container
            const userJwt = jwt.sign(
                {
                    id: existingUser.id,
                    email: existingUser.email
                }, 
                // "asdf" // signing key
                process.env.JWT_KEY! // make sure defined at the start-up of the application
                // non-null assertion operator
                // tells the tsc to treat the variable as if it is not null or undefined.
            );

            // store the jwt in the cookie session, 
            // cookie-session middleware will automatically serialize session object into the cookies of response
            req.session = {
                jwt: userJwt
            }

            return res.status(200).send(existingUser);
        }


    }
);

export { router as signinRouter };