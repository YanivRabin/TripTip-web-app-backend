import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import User from '../model/user_model';
import Post from'../model/post_model';


let app: Express;
let accessToken: string = "";
let postId: string = "";
const user = {
    email: "yaniv@rabin.com",
    password: "yanivrabin",
    name: "yaniv"
}
const post = {
    owner: "",
    description: "description",
    photo: "photo"
}

beforeAll(async () => {
    console.log("brforeAll");
    app = await initApp();
    await User.deleteMany();
    await Post.deleteMany();
    const res = await request(app).post("/auth/register").send(user);
    post.owner = res.body._id;
    const res2 = await request(app).post("/auth/login").send(user);
    accessToken = res2.body.accessToken;
});

afterAll((done) => {
    mongoose.connection.close()
    done();
});

describe("-- Post tests --", () => {

    test("test create post - success", async () => {
        const res = await request(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + accessToken)
            .send(post);
        expect(res.statusCode).toBe(200);
        postId = res.body._id;
    });

    test("test create post - missing description and photo", async () => {
        const res = await request(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ owner: post.owner });
        expect(res.statusCode).toBe(400);
    });

    test("test create post - missing owner", async () => {
        const res = await request(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ description: post.description, photo: post.photo });
        expect(res.statusCode).toBe(401);
    });

    test("test create post - invalid owner", async () => {
        const res = await request(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ owner: "000000000000000000000000", description: post.description, photo: post.photo });
        expect(res.statusCode).toBe(401);
    });

    test("test get all posts - success", async () => {
        const res = await request(app)
            .get("/post")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
    });

    test("test get posts by owner - success", async () => {
        const res = await request(app)
            .get("/post/" + post.owner)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
    });

    test("test update post - success", async () => {
        const res = await request(app)
            .put("/post/" + postId)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(200);
    });

    test("test update post - missing description and photo", async () => {
        const res = await request(app)
            .put("/post/" + postId)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({});
        expect(res.statusCode).toBe(400);
    });

    test("test update post - invalid id", async () => {
        const res = await request(app)
            .put("/post/000000000000000000000000")
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(401);
    });

    test("test update post - missing id", async () => {
        const res = await request(app)
            .put("/post/")
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(404);
    });

    test("test delete post - success", async () => {
        const res = await request(app)
            .delete("/post/" + postId)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
    });

    test("test delete post - invalid id", async () => {
        const res = await request(app)
            .delete("/post/000000000000000000000000")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(401);
    });

    test("test delete post - missing id", async () => {
        const res = await request(app)
            .delete("/post/")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(404);
    });
});