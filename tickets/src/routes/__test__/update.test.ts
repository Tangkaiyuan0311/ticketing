import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";

it ("return 404 if ticket id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`) // arbitrary valid id
    .set("Cookie", global.signin())
    .send({
        title: "newTitle",
        price: 20
    })
    .expect(404);
});



it ("return 401 if user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`) // arbitrary valid id
    .send({
        title: "newTitle",
        price: 20
    })
    .expect(401);
});

it ("return 401 if user does not own the ticket", async () => {
    // add a ticket
    const newTicket = await request(app).post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title: "name", 
        price: 20
    }).expect(201);

    // try to edit the ticket from a different user
    const editedTicket = await request(app).put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', global.signin()) // a random, different user
    .send({
        title: "newName", 
        price: 20
    }).expect(401);
    
});


it ("return 400 if user provide invalid title/price", async () => {
    const userCookie = global.signin();
    // add a ticket
    const newTicket = await request(app).post("/api/tickets")
    .set('Cookie', userCookie)
    .send({
        title: "name", 
        price: 20
    }).expect(201);

    // try to edit the ticket from the same user
    // invalid title/price
    const editedTicket = await request(app).put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', userCookie) // same user
    .send({
        title: "newName", 
        price: -10
    }).expect(400);
});

it ("update ticket with valid input", async () => {
    const userCookie = global.signin();
    // add a ticket
    const newTicket = await request(app).post("/api/tickets")
    .set('Cookie', userCookie)
    .send({
        title: "name", 
        price: 20
    }).expect(201);

    // try to edit the ticket from the same user
    // valid title/price
    const editedTicket = await request(app).put(`/api/tickets/${newTicket.body.id}`)
    .set('Cookie', userCookie) // same user
    .send({
        title: "newName", 
        price: 10
    }).expect(200);
    
    // fetch the edited ticket
    const fetchedTicket = await request(app)
    .get(`/api/tickets/${editedTicket.body.id}`)
    .send()
    .expect(200);

    expect(fetchedTicket.body.title).toEqual("newName");
    expect(fetchedTicket.body.price).toEqual(10);
});