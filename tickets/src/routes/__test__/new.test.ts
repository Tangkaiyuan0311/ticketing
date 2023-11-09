import request from "supertest";
import { app } from "../../app";

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

});

it ("return error if invalid price is provided", async () => {

});

it ("ticket created with valid input", async () => {

});