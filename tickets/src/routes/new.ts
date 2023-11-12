import express, {Request, Response} from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@tky-services/common";
import { Ticket } from "../../models/ticket";

const router = express.Router();

// create a new ticket from authenticated user
router.post("/api/tickets", requireAuth, 
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
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id // requireAuth make sure defined
        });
        await ticket.save();
        res.status(201).send(ticket);
    }
);

export {router as createTicketRouter};

