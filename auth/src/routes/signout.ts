import express from "express";

const router = express.Router();

router.get("/api/users/signout", (req, res) => {
    // destroys the session for the current user, clears the session data stored on the server side. 
    // When the response is sent to the client, the session cookie will also be updated to reflect this change, 
    // essentially removing the session data from the client's browser as well.
    req.session = null;

    res.status(200).send({});
});

export { router as signoutRouter };