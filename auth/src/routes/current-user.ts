// browser may come to confirm if a user is currently logged in
// examine the cookies of request
import express from "express";
import { requireAuth } from "../middlewares/require-auth";
import { currentUser } from "../middlewares/current-user";

const router = express.Router();

// if current user jwt in cookies is not verified by currentUser, 
// requireAuth will throw error
router.get("/api/users/currentuser", currentUser, (req, res) => {
    res.status(200).send({
        currentUser: req.currentUser // set by middleware: currentUser
    })
});

export { router as currentUserRouter };