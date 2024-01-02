import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';


let app: Express;
beforeAll(async () => {
    app = await initApp();
});

afterAll((done) => {
    mongoose.connection.close()
    done();
});

describe("-- Test --", () => {
    test("test", async () => {
        const res = await request(app).get('/student');
        expect(res.statusCode).toEqual(200);
        const data = res.body;
        expect(data.length).toEqual(0);
    });
});