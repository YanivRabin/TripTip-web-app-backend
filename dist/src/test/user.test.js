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
const User = require("../model/user_model");
let app;
const user = {
    email: "yaniv@rabin.com",
    password: "yanivrabin",
    name: "yaniv"
};
// let accessToken: string;
let refreshToken;
// let newRefreshToken: string;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("brforeAll");
    app = yield (0, app_1.default)();
    yield User.deleteMany({ email: user.email });
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("-- User tests --", () => {
    test("test register - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(user);
        expect(res.statusCode).toBe(201);
    }));
    test("test register - exist email", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(user);
        expect(res.statusCode).toBe(406);
    }));
    test("test register - missing password and name", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send({ email: "test@fail.com" });
        expect(response.statusCode).toBe(400);
    }));
    test("test login - success", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).not.toBe(null);
        expect(res.body.refreshToken).not.toBe(null);
    }));
    test("test login - missing password", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: user.email });
        expect(res.statusCode).toBe(400);
    }));
    test("test login - worng password", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: "yaniv@rabin.com", password: "01234" });
        expect(res.statusCode).toBe(401);
    }));
    test("test token - refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/auth/refreshToken")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
    }));
    // test("test ", async () => {})
});
//# sourceMappingURL=user.test.js.map