import request from "supertest"; // fake request to the application
import { app } from "../../app";

it("returns 201 on successful signup",async () => {
    await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@test.com",
        password: "1234567"
    })
    .expect(201);
});


// email not exist
it("returns 400 on non-existing email",async () => {
    await request(app)
    .post("/api/users/signin")
    .send({
        email: "stranger@test.com",
        password: "1234567"
    })
    .expect(400);
});


// wrong password
it("returns 400 on wrong password",async () => {
    await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@test.com",
        password: "1234567"
    })
    .expect(201);

    await request(app)
    .post("/api/users/signin")
    .send({
        email: "test@test.com",
        password: "wongpassword"
    })
    .expect(400);
});
it("sets a cookie after successful signin",async () => {
    await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@test.com",
        password: "1234567"
    })
    .expect(201);

    const response = await request(app)
    .post("/api/users/signin")
    .send({
        email: "test@test.com",
        password: "1234567"
    })
    .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
});