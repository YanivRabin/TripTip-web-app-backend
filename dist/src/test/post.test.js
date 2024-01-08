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
let accessToken = "";
let postId = "";
const user = {
    email: "yaniv@rabin.com",
    password: "yanivrabin",
    name: "yaniv"
};
const post = {
    owner: "",
    description: "description",
    photo: "photo"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("brforeAll");
    app = yield (0, app_1.default)();
    yield user_model_1.default.deleteMany();
    yield post_model_1.default.deleteMany();
    const res = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    post.owner = res.body._id;
    const res2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = res2.body.accessToken;
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("-- Post tests --", () => {
    test("test create post - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + accessToken)
            .send(post);
        expect(res.statusCode).toBe(200);
        postId = res.body._id;
    }));
    test("test create post - missing description and photo", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ owner: post.owner });
        expect(res.statusCode).toBe(400);
    }));
    test("test create post - missing owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ description: post.description, photo: post.photo });
        expect(res.statusCode).toBe(401);
    }));
    test("test create post - invalid owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/post")
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ owner: "000000000000000000000000", description: post.description, photo: post.photo });
        expect(res.statusCode).toBe(401);
    }));
    test("test get all posts - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/post")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
    }));
    test("test get posts by owner - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/post/" + post.owner)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
    }));
    test("test update post - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/post/" + postId)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(200);
    }));
    test("test update post - missing description and photo", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/post/" + postId)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({});
        expect(res.statusCode).toBe(400);
    }));
    test("test update post - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/post/000000000000000000000000")
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(401);
    }));
    test("test update post - missing id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put("/post/")
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ description: "new description" });
        expect(res.statusCode).toBe(404);
    }));
    test("test delete post - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete("/post/" + postId)
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
    }));
    test("test delete post - invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete("/post/000000000000000000000000")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(401);
    }));
    test("test delete post - missing id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete("/post/")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=post.test.js.map