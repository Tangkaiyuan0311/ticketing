import express, {NextFunction, Request, Response} from "express";
import { Ticket } from "../../models/ticket";
import { RouteNotFoundError } from "@tky-services/common";

const router = express.Router();

// fetch a ticket from all users
router.get("/api/tickets/:id", 
    async (req: Request, res: Response, next: NextFunction) => {
        let ticket = null;
        try {
            ticket = await Ticket.findById(req.params.id);
        } catch (error) {
            return next(error);
        }
        // const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return next(new RouteNotFoundError("Ticket Not Found!"));
        }
        // success
        res.status(200).send(ticket);
    }
);

export {router as showTicketRouter};