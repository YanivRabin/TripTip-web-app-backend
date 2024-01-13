import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import User from '../model/user_model';


let app: Express;
let accessToken: string = "";
let refreshToken: string = "";
const user = {
    email: "yaniv@rabin.com",
    password: "yanivrabin",
    name: "yaniv"
}

beforeAll(async () => {
    console.log("brforeAll");
    app = await initApp();
    await User.deleteMany();
});

afterAll((done) => {
    mongoose.connection.close()
    done();
});

describe("-- Auth tests --", () => {

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
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
    });

    test("test login - missing password", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: user.email });
        expect(res.statusCode).toBe(400);
    });

    test("test login - worng password", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: "yaniv@rabin.com", password: "01234" });
        expect(res.statusCode).toBe(401);
    });

    test("test token - forbidden access without token", async () => {
        const res = await request(app).get("/posts/getAllPosts");
        expect(res.statusCode).toBe(401);
    });

    test("test token - success", async () => {
        const res = await request(app)
            .get("/posts/getAllPosts")
            .set("Authorization", "Bearer " + accessToken);
        expect(res.statusCode).toBe(200);
    });

    test("test token - invalid token", async () => {
        const res = await request(app)
            .get("/posts/getAllPosts")
            .set("Authorization", "Bearer " + accessToken + "1");
        expect(res.statusCode).toBe(401);
    });

    jest.setTimeout(15000); //set a specific timeout for this test

    test("test token - expired token", async () => {
        //Simulate a delay of 4 seconds
        await new Promise(resolve => setTimeout(resolve, 4000));
        const res = await request(app)
            .get("/posts/getAllPosts")
            .set("Authorization", "Bearer " + accessToken);
        expect(res.statusCode).toBe(401);
    });
    
    test("test refresh token - success", async () => {
        const res = await request(app)
            .get("/auth/refreshToken")
            .set("Authorization", "Bearer " + refreshToken)
            .send();
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).not.toBe(null);
        expect(res.body.refreshToken).not.toBe(null);
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        const res2 = await request(app)
            .get("/posts/getAllPosts")
            .set("Authorization", "Bearer " + accessToken);
        expect(res2.statusCode).toBe(200);
    });

    test("test logout - success", async () => {
        const res = await request(app)
            .get("/auth/logout")
            .set("Authorization", "Bearer " + refreshToken);
        expect(res.statusCode).toBe(200);
        refreshToken = res.body.refreshToken;
        const res2 = await request(app)
            .get("/auth/refreshToken")
            .set("Authorization", "Bearer " + refreshToken)
            .send();
        expect(res2.statusCode).toBe(403);
    });
});