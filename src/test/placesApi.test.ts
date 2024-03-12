import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import http from 'http';


let app: http.Server;
beforeAll(async () => {
  console.log("brforeAll");
  app = await initApp();
});

afterAll((done) => {
  mongoose.connection.close()
  done();
});


describe("-- Places API Tests --", () => {
  test("Places API - fetch tips for each country", async () => {
    const res = await request(app)
    .get("/api/review")
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});
