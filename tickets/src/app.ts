// for testing
// no port binding and database connection

import express from "express";
import { json } from "body-parser";

import cookieSession from 'cookie-session';
import { createTicketRouter } from "./routes/new";
import { currentUser, errorHandler, RouteNotFoundError,  } from "@tky-services/common";
import { showTicketRouter } from "./routes/show";

const app = express();

app.use(json());
app.set("trust proxy", true); // make express to trust the traffic from ingress proxy

// Middleware Chain: When a request (req) comes in, it goes through a chain of middlewares. 
// The cookie-session middleware adds a session property to the req object early in this chain. 
// Subsequent middleware and route handlers can read from or modify this session object. 
// Finally, the cookie-session middleware serializes the session object back into a cookie as part of the response (res), 
// which is abstracted away from user.
app.use(cookieSession({
    signed: false, // disable the encryption of cookie content, jwt in this case (jwd already prevent tampering)
    secure: process.env.NODE_ENV !== "test" // disable https requirement for testing environment
    // secure: true
}));

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);




// handle error in async fun
app.all("*", async (req, res, next) => {
    next(new RouteNotFoundError(req.protocol + '://' + req.get('host') + req.originalUrl));
})

app.use(errorHandler);

export { app };