import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";

it ("return 404 if ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`) // arbitrary valid id
    .send()
    .expect(404);
});

it ("return ticket if ticket is found", async () => {
    const title = "concert";
    const price = 20;

    // add a ticket
    const newTicket = await request(app).post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title, 
        price
    }).expect(201);

    // fetch the added ticket
    const fetchedTicket = await request(app)
    .get(`/api/tickets/${newTicket.body.id}`)
    .send()
    .expect(200);

    expect(fetchedTicket.body.title).toEqual(title);
    expect(fetchedTicket.body.price).toEqual(price);  
});