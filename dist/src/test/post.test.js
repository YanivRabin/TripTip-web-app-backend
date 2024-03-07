"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../model/user_model"));
const post_model_1 = __importDefault(require("../model/post_model"));
let app;
// user1
const user = {
    email: "yaniv@rabin.com",
    password: "yanivrabin",
    name: "yaniv",
    accessToken: ""
};
const post = {
    owner: "",
    description: "description",
    photo: "photo"
};
const post2 = {
    owner: "",
    description: "description2",
    photo: "photo2"
};
// user2
const user2 = {
    email: "roy@toledo.com",
    password: "roytoledo",
    name: "roy",
    accessToken: ""
};
const post3 = {
    owner: "",
    description: "description3",
    photo: "photo3"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("brforeAll");
    app = yield (0, app_1.default)();
    yield user_model_1.default.deleteMany();
    yield post_model_1.default.deleteMany();
    // create user1 and get access token
    const res = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    user['_id'] = res.body.user._id;
    user.accessToken = res.body.accessToken;
    post.owner = res.body.user._id;
    post2.owner = res.body.user._id;
    // create user2 and get access token
    const res2 = yield (0, supertest_1.default)(app).post("/auth/register").send(user2);
    user2['_id'] = res2.body.user._id;
    user2.accessToken = res2.body.accessToken;
    post3.owner = res2.body.user._id;
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("-- Post tests --", () => {
    test("test create post - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send(post);
        expect(res.statusCode).toBe(200);
        // save post id for later use
        post['_id'] = res.body._id;
    }));
    test("test create post2 - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send(post2);
        expect(res.statusCode).toBe(200);
        // save post id for later use
        post2['_id'] = res.body._id;
    }));
    test("test create post3 - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user2.accessToken)
            .send(post3);
        expect(res.statusCode).toBe(200);
        // save post id for later use
        post3['_id'] = res.body._id;
    }));
    test("test create post - missing description and photo", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ owner: user['_id'] });
        expect(res.statusCode).toBe(400);
    }));
    test("test create post - missing owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: post.description, photo: post.photo });
        expect(res.statusCode).toBe(401);
    }));
    test("test create post - invalid owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/posts/createPost")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ owner: "000000000000000000000000", description: post.description, photo: post.photo });
        expect(res.statusCode).toBe(401);
    }));
    test("test get all posts - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/posts/getAllPosts")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(3);
    }));
    test("test get posts by owner1 - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/posts/getPostByOwner/" + user['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    }));
    test("test get posts by owner2 - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/posts/getPostByOwner/" + user2['_id'])
            .set('Authorization', 'Bearer ' + user2.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    }));
    test("test get post by id - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/posts/postId/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(post['_id']);
        expect(res.body.description).toBe(post.description);
        expect(res.body.photo).toBe(post.photo);
    }));
    test("test update post - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/posts/updatePost/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(200);
    }));
    test("test update post - missing description and photo", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/posts/updatePost/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({});
        expect(res.statusCode).toBe(400);
    }));
    test("test update post - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/posts/updatePost/000000000000000000000000")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(401);
    }));
    test("test update post - missing id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/posts/updatePost/")
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(404);
    }));
    test("test delete post - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete("/posts/deletePost/" + post['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
    }));
    test("test delete post - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete("/posts/deletePost/000000000000000000000000")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(401);
    }));
    test("test delete post - missing id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete("/posts/deletePost/")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(404);
    }));
    test("test get all posts after delete one - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/posts/getAllPosts")
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    }));
    test("test comment post - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/posts/createComment/" + post3['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({ user: user.name, comment: "comment" });
        expect(res.statusCode).toBe(200);
    }));
    test("test comment post - missing user and comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/posts/createComment/" + post3['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken)
            .send({});
        expect(res.statusCode).toBe(400);
    }));
    test("test get post comments - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/posts/getComments/" + post3['_id'])
            .set('Authorization', 'Bearer ' + user.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    }));
});
//# sourceMappingURL=post.test.js.map