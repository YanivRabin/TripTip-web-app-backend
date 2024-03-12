import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import User from '../model/user_model';
import Post from'../model/post_model';
import http from 'http';


let app: http.Server;
// user1
const user = {
    email: "yaniv@rabin.com",
    password: "yanivrabin",
    name: "yaniv",
    accessToken: ""
}
const post = {
    name: "",
    description: "description",
    photo: "photo"
}
const post2 = {
    name: "",
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
    name: "",
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
    user.accessToken = res.body.accessToken;
    post.name = res.body.user.name;
    post2.name = res.body.user.name;
    // create user2 and get access token
    const res2 = await request(app).post("/auth/register").send(user2);
    user2.accessToken = res2.body.accessToken;
    post3.name = res2.body.user.name;
});

afterAll((done) => {
    mongoose.connection.close()
    done();
});

describe("-- Post tests --", () => {

    test("test create post - success", async () => {
        console.log(post);
        
        const res = await request(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send(post);
        expect(res.statusCode).toBe(200);
        // save post id for later use
        post['_id'] = res.body._id;
    });

    test("test create post2 - success", async () => {
        const res = await request(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send(post2);
        expect(res.statusCode).toBe(200);
        // save post id for later use
        post2['_id'] = res.body._id;
    });

    test("test create post3 - success", async () => {
        const res = await request(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user2.accessToken)
            .send(post3);
        expect(res.statusCode).toBe(200);
        // save post id for later use
        post3['_id'] = res.body._id;
    });

    test("test create post - missing description and photo", async () => {
        const res = await request(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ name: user['_id'] });
        expect(res.statusCode).toBe(400);
    });

    test("test create post - missing name", async () => {
        const res = await request(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: post.description, photo: post.photo });
        expect(res.statusCode).toBe(401);
    });

    test("test create post - invalid name", async () => {
        const res = await request(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ name: "000000000000000000000000", description: post.description, photo: post.photo });
        expect(res.statusCode).toBe(401);
    });

    test("test get all posts - success", async () => {
        const res = await request(app)
            .get("/posts/getAllPosts")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(3);
    });

    test("test get posts by name1 - success", async () => {
        const res = await request(app)
            .get("/posts/getPostByname/" + user.name)
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    test("test get posts by name2 - success", async () => {
        const res = await request(app)
            .get("/posts/getPostByname/" + user2.name)
            .set('Authorization', 'Bearer ' + user2.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    });

    test("test get post by id - success", async () => {
        const res = await request(app)
            .get("/posts/postId/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(post['_id']);
        expect(res.body.description).toBe(post.description);
    });

    test("test update post - success", async () => {
        const res = await request(app)
            .put("/posts/updatePost/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(200);
    });

    test("test update post - missing description and photo", async () => {
        const res = await request(app)
            .put("/posts/updatePost/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({});
        expect(res.statusCode).toBe(400);
    });

    test("test update post - invalid id", async () => {
        const res = await request(app)
            .put("/posts/updatePost/000000000000000000000000")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(401);
    });

    test("test update post - missing id", async () => {
        const res = await request(app)
            .put("/posts/updatePost/")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(404);
    });

    test("test delete post - success", async () => {
        const res = await request(app)
            .delete("/posts/deletePost/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
    });

    test("test delete post - invalid id", async () => {
        const res = await request(app)
            .delete("/posts/deletePost/000000000000000000000000")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(401);
    });

    test("test delete post - missing id", async () => {
        const res = await request(app)
            .delete("/posts/deletePost/")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(404);
    });

    test("test get all posts after delete one - success", async () => {
        const res = await request(app)
            .get("/posts/getAllPosts")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    test("test comment post - success", async () => {
        const res = await request(app)
            .put("/posts/createComment/" + post3['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ user: user.name, comment: "comment" });
        expect(res.statusCode).toBe(200);
    });

    test("test comment post - missing user and comment", async () => {
        const res = await request(app)
            .put("/posts/createComment/" + post3['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({});
        expect(res.statusCode).toBe(400);
    });

    test("test get post comments - success", async () => {
        const res = await request(app)
            .get("/posts/getComments/" + post3['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    });
});