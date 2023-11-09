import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from "supertest"; 
import jwt from 'jsonwebtoken';

let mongo: MongoMemoryServer;

declare global {
  var signin: () => string[];
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
// should not directly contact auth service
// no inter-services communication
global.signin = () => {
  // build a JWT payload
  const payload = {
    id: '1lk24j124l',
    email: 'test@test.com'
  };
  // create th signed JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session object: {jwt: myJwt}
  const session = { jwt: token };

  // simulate what cookies session middleware do

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // build the cookie
  return [`session=${base64}`];
}
