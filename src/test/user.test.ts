import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import User = require('../model/user_model');


let app: Express;
const user = {
    email: "yaniv@rabin.com",
    password: "yanivrabin",
    name: "yaniv"
}
// let accessToken: string;
let refreshToken: string;
// let newRefreshToken: string;

beforeAll(async () => {
    console.log("brforeAll");
    app = await initApp();
    await User.deleteMany({ email: user.email });
});

afterAll((done) => {
    mongoose.connection.close()
    done();
});

describe("-- User tests --", () => {

    test("test register - success", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send(user);
        expect(res.statusCode).toBe(201);
    });

    test("test register - exist email", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send(user);
        expect(res.statusCode).toBe(406);
    });

    test("test register - missing password and name", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({ email: "test@fail.com" });
        expect(response.statusCode).toBe(400);
    });

    test("test login - success", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).not.toBe(null);
        expect(res.body.refreshToken).not.toBe(null);
    });

    test("test login - missing password", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: user.email });
        expect(res.statusCode).toBe(400);
    })

    test("test login - worng password", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: "yaniv@rabin.com", password: "01234" });
        expect(res.statusCode).toBe(401);
    })

    test("test token - refresh token", async () => {
        const res = await request(app)
            .post("/auth/refreshToken")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
    })
    // test("test ", async () => {})
});