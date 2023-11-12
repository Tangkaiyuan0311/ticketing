import express, {NextFunction, Request, Response} from "express";
import { Ticket } from "../../models/ticket";
import { RouteNotFoundError, requireAuth, validateRequest, NotAuthorizedError } from "@tky-services/common";
import { body } from "express-validator";

const router = express.Router();

// update ticket givin a ticket id
// only for authenticated user
router.put("/api/tickets/:id",
    requireAuth,
    // express validator, append validation error to request
    [
        body("title")
        .not().isEmpty()
        .withMessage("Title is required"),

        body("price")
        .isFloat({gt : 0})
        .withMessage("Price must be greater than 0")
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        // find the ticket with provided ticket id
        let ticket = null;
        try {
            ticket = await Ticket.findById(req.params.id);
        } catch (error) {
            return next(error);
        }
        if (!ticket) {
            return next(new RouteNotFoundError("Ticket Not Found!"));
        }

        // check if the user own the ticket
        const userId = req.currentUser!.id;
        const createBy = ticket.userId;
        if (userId != createBy) {
            return next(new NotAuthorizedError());
        }

        // update ticket info
        ticket.set({
            title: req.body.title,
            price: req.body.price
        });

        await ticket.save();

        // ticket is already the updated version


        // success
        res.status(200).send(ticket);
    }
);

export {router as updateTicketRouter};