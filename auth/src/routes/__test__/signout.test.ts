import request from "supertest"; // fake request to the application
import { app } from "../../app";

it("clears a cookie after signout",async () => {
    let response = await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@test.com",
        password: "1234567"
    })
    .expect(201);
    // console.log(response.get("Set-Cookie"));

    response = await request(app)
    .get("/api/users/signout")
    .expect(200);
    expect(response.get("Set-Cookie")[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
});