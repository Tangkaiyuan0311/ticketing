import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";

const createRandomTickets = () => {
    return request(app).post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title: "randomName",
        price: 20
    });
}

it ("fetch a list of tickets", async () => {

    // add several ticket
    await createRandomTickets();
    await createRandomTickets();
    await createRandomTickets();

    // check size
    const response = await request(app).get("/api/tickets")
    .send()
    .expect(200);

    expect(response.body.length).toEqual(3);
});