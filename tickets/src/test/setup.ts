import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from "supertest"; 

let mongo: MongoMemoryServer;

declare global {
  var signup: (email: string, password: string) => Promise<string[]>;
}

// hook before all tests are started
beforeAll(async () => {
  process.env.JWT_KEY = "asdf"; // manually set the env
  // console.log(process.env.NODE_ENV);
  mongo = await MongoMemoryServer.create(); // Create a Mongo-Memory-Sever Instanc
  const mongoUri = mongo.getUri(); // Generate the Connection string

  await mongoose.connect(mongoUri, {});
});

// hook before each test
// reset all existing collections
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// after all the tests
// stop the server, close the connection
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// export a helper under test environment
// sign up a fake user and retrieve the value of the Set-Cookie header from the response
global.signup = async(email: string, password: string) => {
  const response = await request(app)
  .post("/api/users/signup")
  .send({
      email,
      password
  })
  .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
}
