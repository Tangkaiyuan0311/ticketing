import express, {NextFunction, Request, Response} from "express";
import { Ticket } from "../../models/ticket";
import { RouteNotFoundError } from "@tky-services/common";

const router = express.Router();

// fetch all tickets
router.get("/api/tickets/", 
    async (req: Request, res: Response, next: NextFunction) => {
        let tickets = null;
        try {
            tickets = await Ticket.find({});
        } catch (error) {
            return next(error);
        }
        if (!tickets) {
            return next(new RouteNotFoundError("Tickets Not Found!"));
        }
        // success
        res.status(200).send(tickets);
    }
);

export {router as indexTicketRouter};