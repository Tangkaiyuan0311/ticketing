import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../../models/ticket";

it ("has a router handler listening to /api/tickets for post request", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).not.toEqual(404);
});

it ("can only be accessed if signed in", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).toEqual(401);
});

it ("return status other than 401 if signed in", async () => {
    const response = await request(app).post("/api/tickets")
    .set('Cookie', global.signin())
    .send({});
    expect(response.status).not.toEqual(401);
});

it ("return error if invalid title is provided", async () => {
    const response = await request(app).post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title: "", // invalid title
        price: 10, 
    });
    expect(response.status).toEqual(400);
});

it ("return error if invalid price is provided", async () => {
    const response = await request(app).post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title: "name", 
        price: -10, // invalid
    });
    expect(response.status).toEqual(400);
});

it ("ticket created with valid input", async () => {
    // check if a new ticket is added into database
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0); // as the result of before each hook

    const response = await request(app).post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title: "name", 
        price: 100,
    }).expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1); // one more docs

});