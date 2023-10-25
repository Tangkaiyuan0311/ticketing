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
it("returns 400 on invalid email or password",async () => {
    await request(app)
    .post("/api/users/signup")
    .send({
        email: "test",
        password: "1234567"
    })
    .expect(400);

    await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@test.com",
        password: "1"
    })
    .expect(400);

});
it("disallow email duplication",async () => {
    await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@test.com",
        password: "1234567"
    })
    .expect(201);

    await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@test.com",
        password: "1234567"
    })
    .expect(400);

});
it("sets a cookie after successful signup",async () => {
    const response = await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@test.com",
        password: "1234567"
    })
    .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
});