import request from "supertest"; // fake request to the application
import { app } from "../../app";

it("return info about current logged-in user",async () => {

    // by default, jest will not put cookies from reponse into latter request
    const cookies = await global.signup("test@test.com", "password");

    const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookies)
    .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");
    //console.log(response.body.currentUser.email);
});

it("return info if not logged in",async () => {

    // by default, jest will not put cookies from reponse into latter request

    const response = await request(app)
    .get("/api/users/currentuser")
    .expect(200);

    expect(response.body.currentUser).toBeUndefined();
    //console.log(response.body.currentUser);
});