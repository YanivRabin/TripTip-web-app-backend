import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import User from '../model/user_model';
import Post from'../model/post_model';


let app: Express;
// user1
const user = {
    email: "yaniv@rabin.com",
    password: "yanivrabin",
    name: "yaniv",
    accessToken: ""
}
const post = {
    owner: "",
    description: "description",
    photo: "photo"
}
const post2 = {
    owner: "",
    description: "description2",
    photo: "photo2"
}
// user2
const user2 = {
    email: "roy@toledo.com",
    password: "roytoledo",
    name: "roy",
    accessToken: ""
}
const post3 = {
    owner: "",
    description: "description3",
    photo: "photo3"
}

beforeAll(async () => {
    console.log("brforeAll");
    app = await initApp();
    await User.deleteMany();
    await Post.deleteMany();
    // create user1 and get access token
    const res = await request(app).post("/auth/register").send(user);
    user['_id'] = res.body._id;
    post.owner = res.body._id;
    post2.owner = res.body._id;
    const res2 = await request(app).post("/auth/login").send(user);
    user.accessToken = res2.body.accessToken;
    // create user2 and get access token
    const res3 = await request(app).post("/auth/register").send(user2);
    user2['_id'] = res3.body._id;
    post3.owner = res3.body._id;
    const res4 = await request(app).post("/auth/login").send(user2);
    user2.accessToken = res4.body.accessToken;
});

afterAll((done) => {
    mongoose.connection.close()
    done();
});

describe("-- Post tests --", () => {

    test("test create post - success", async () => {
        const res = await request(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send(post);
        expect(res.statusCode).toBe(200);
        // save post id for later use
        post['_id'] = res.body._id;
    });

    test("test create post2 - success", async () => {
        const res = await request(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send(post2);
        expect(res.statusCode).toBe(200);
        // save post id for later use
        post2['_id'] = res.body._id;
    });

    test("test create post3 - success", async () => {
        const res = await request(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + user2.accessToken)
            .send(post3);
        expect(res.statusCode).toBe(200);
        // save post id for later use
        post3['_id'] = res.body._id;
    });

    test("test create post - missing description and photo", async () => {
        const res = await request(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ owner: user['_id'] });
        expect(res.statusCode).toBe(400);
    });

    test("test create post - missing owner", async () => {
        const res = await request(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: post.description, photo: post.photo });
        expect(res.statusCode).toBe(401);
    });

    test("test create post - invalid owner", async () => {
        const res = await request(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ owner: "000000000000000000000000", description: post.description, photo: post.photo });
        expect(res.statusCode).toBe(401);
    });

    test("test get all posts - success", async () => {
        const res = await request(app)
            .get("/post")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(3);
    });

    test("test get posts by owner1 - success", async () => {
        const res = await request(app)
            .get("/post/" + user['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    test("test get posts by owner2 - success", async () => {
        const res = await request(app)
            .get("/post/" + user2['_id'])
            .set('Authorization', 'Bearer ' + user2.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    });

    test("test get post by id - success", async () => {
        const res = await request(app)
            .get("/post/postId/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(post['_id']);
        expect(res.body.description).toBe(post.description);
        expect(res.body.photo).toBe(post.photo);
    });

    test("test update post - success", async () => {
        const res = await request(app)
            .put("/post/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(200);
    });

    test("test update post - missing description and photo", async () => {
        const res = await request(app)
            .put("/post/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({});
        expect(res.statusCode).toBe(400);
    });

    test("test update post - invalid id", async () => {
        const res = await request(app)
            .put("/post/000000000000000000000000")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(401);
    });

    test("test update post - missing id", async () => {
        const res = await request(app)
            .put("/post/")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(404);
    });

    test("test delete post - success", async () => {
        const res = await request(app)
            .delete("/post/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
    });

    test("test delete post - invalid id", async () => {
        const res = await request(app)
            .delete("/post/000000000000000000000000")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(401);
    });

    test("test delete post - missing id", async () => {
        const res = await request(app)
            .delete("/post/")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(404);
    });

    test("test get all posts after delete one - success", async () => {
        const res = await request(app)
            .get("/post")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    test("test comment post - success", async () => {
        const res = await request(app)
            .put("/post/comment/" + post3['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ user: user.name, comment: "comment" });
        expect(res.statusCode).toBe(200);
    });

    test("test comment post - missing user and comment", async () => {
        const res = await request(app)
            .put("/post/comment/" + post3['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({});
        expect(res.statusCode).toBe(400);
    });

    test("test get post comments - success", async () => {
        const res = await request(app)
            .get("/post/comment/" + post3['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    });

    
});